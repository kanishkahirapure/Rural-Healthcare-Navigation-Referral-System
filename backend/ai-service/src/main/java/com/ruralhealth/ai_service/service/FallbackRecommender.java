package com.ruralhealth.ai_service.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.ruralhealth.ai_service.dto.DoctorDto;
import com.ruralhealth.ai_service.dto.FacilityDto;
import com.ruralhealth.ai_service.dto.RecommendationItem;
import com.ruralhealth.ai_service.dto.RecommendationRequest;
import com.ruralhealth.ai_service.dto.RecommendationResponse;
import com.ruralhealth.ai_service.util.GeoUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * Simple keyword-based recommender used when Gemini fails or returns unusable output.
 * It has no external dependencies, so the demo never breaks.
 */
@Slf4j
@Component
public class FallbackRecommender {

    /** specialization = label we return; stems = how it appears in doctor data; keywords = symptom words. */
    private record Rule(String specialization, List<String> stems, List<String> keywords) { }

    private static final Rule GENERAL = new Rule("General Medicine",
            List.of("general", "physician", "medicine", "mbbs"),
            List.of("fever", "cold", "weakness", "headache", "body ache", "fatigue", "infection"));

    private static final List<Rule> RULES = List.of(
            new Rule("Cardiology", List.of("cardio"),
                    List.of("chest pain", "heart", "palpitation", "breathless", "blood pressure")),
            new Rule("Pulmonology", List.of("pulmo", "respirat"),
                    List.of("cough", "asthma", "wheez", "breath", "tuberculosis")),
            new Rule("Neurology", List.of("neuro"),
                    List.of("seizure", "convulsion", "stroke", "paralysis", "migraine", "dizz", "numbness")),
            new Rule("Orthopedics", List.of("orthop"),
                    List.of("fracture", "bone", "joint", "back pain", "knee", "sprain")),
            new Rule("Pediatrics", List.of("pediatric", "paediatric"),
                    List.of("child", "baby", "infant", "newborn", "toddler")),
            new Rule("Gynecology", List.of("gynec", "gynaec", "obstet"),
                    List.of("pregnan", "delivery", "menstr", "period", "labour")),
            new Rule("Gastroenterology", List.of("gastro"),
                    List.of("stomach", "vomit", "diarr", "abdominal", "acidity", "loose motion")),
            new Rule("Dermatology", List.of("derma"),
                    List.of("rash", "skin", "itch")),
            new Rule("ENT", List.of("ent", "otolaryng"),
                    List.of("earache", "ear pain", "ear discharge", "hearing", "throat", "nose", "sinus", "tonsil")),
            new Rule("Ophthalmology", List.of("ophthal"),
                    List.of("eye", "vision", "blurred")),
            GENERAL);

    private static final List<String> EMERGENCY_KEYWORDS = List.of(
            "chest pain", "heart attack", "unconscious", "not breathing", "cannot breathe", "can't breathe",
            "severe bleeding", "stroke", "seizure", "convulsion", "paralysis", "snake", "poison", "accident");

    private static final Set<String> NON_OPERATING_STATUSES = Set.of("CLOSED", "INACTIVE", "NON_OPERATIONAL");

    private static final int MAX_RESULTS = 5;

    public RecommendationResponse recommend(RecommendationRequest request,
                                            List<FacilityDto> facilities,
                                            List<DoctorDto> doctors) {
        String text = request.getSymptoms().toLowerCase(Locale.ROOT);
        boolean emergency = Boolean.TRUE.equals(request.getIsEmergency());

        Optional<Rule> detected = detectRule(text);
        Rule rule = detected.orElse(GENERAL);

        boolean highUrgency = emergency || countHits(text, EMERGENCY_KEYWORDS) > 0;
        String urgency = highUrgency ? "HIGH" : (detected.isPresent() ? "MEDIUM" : "LOW");

        Map<Long, FacilityDto> facilityById = facilities.stream()
                .filter(f -> f.getId() != null && isOperating(f))
                .collect(Collectors.toMap(FacilityDto::getId, f -> f, (a, b) -> a));

        List<RecommendationItem> items = rankDoctors(request, rule, doctors, facilityById, highUrgency);
        if (items.isEmpty()) {
            items = rankFacilities(request, rule, facilityById, highUrgency);
        }

        log.info("Fallback recommender used: specialization={}, urgency={}, results={}",
                rule.specialization(), urgency, items.size());

        return RecommendationResponse.builder()
                .suggestedSpecialization(rule.specialization())
                .urgency(urgency)
                .recommendations(items)
                .build();
    }

    // ---------- ranking ----------

    private List<RecommendationItem> rankDoctors(RecommendationRequest request, Rule rule,
                                                 List<DoctorDto> doctors,
                                                 Map<Long, FacilityDto> facilityById,
                                                 boolean highUrgency) {
        List<RecommendationItem> items = new ArrayList<>();
        for (DoctorDto doctor : doctors) {
            if (Boolean.FALSE.equals(doctor.getIsAvailable())) {
                continue;
            }
            if (!specializationMatches(doctor.getSpecialization(), rule.stems())) {
                continue;
            }
            FacilityDto facility = facilityById.get(doctor.getFacilityId());
            if (facility == null) {
                continue;
            }
            Double distance = distanceTo(request, facility);
            int score = score(70, distance, highUrgency && isHospital(facility));
            items.add(RecommendationItem.builder()
                    .facilityId(facility.getId())
                    .facilityName(facility.getName())
                    .doctorName(doctor.getName())
                    .reason(String.format("%s specialist available at this facility%s.",
                            doctor.getSpecialization(), distanceText(distance)))
                    .matchScore(score)
                    .build());
        }
        items.sort(Comparator.comparingInt(RecommendationItem::getMatchScore).reversed());
        return items.stream().limit(MAX_RESULTS).toList();
    }

    private List<RecommendationItem> rankFacilities(RecommendationRequest request, Rule rule,
                                                    Map<Long, FacilityDto> facilityById,
                                                    boolean highUrgency) {
        List<FacilityDto> sorted = new ArrayList<>(facilityById.values());
        Comparator<FacilityDto> byType = Comparator.comparingInt(f -> (highUrgency && isHospital(f)) ? 0 : 1);
        Comparator<FacilityDto> byDistance = Comparator.comparingDouble(f -> {
            Double d = distanceTo(request, f);
            return d == null ? Double.MAX_VALUE : d;
        });
        sorted.sort(byType.thenComparing(byDistance));

        List<RecommendationItem> items = new ArrayList<>();
        for (FacilityDto facility : sorted) {
            if (items.size() >= 3) {
                break;
            }
            Double distance = distanceTo(request, facility);
            items.add(RecommendationItem.builder()
                    .facilityId(facility.getId())
                    .facilityName(facility.getName())
                    .doctorName(null)
                    .reason(String.format("No available %s doctor found; suggested as a nearby %s%s.",
                            rule.specialization(), facility.getType(), distanceText(distance)))
                    .matchScore(score(40, distance, highUrgency && isHospital(facility)))
                    .build());
        }
        return items;
    }

    // ---------- helpers ----------

    private static Optional<Rule> detectRule(String text) {
        Rule best = null;
        int bestHits = 0;
        for (Rule rule : RULES) {
            int hits = countHits(text, rule.keywords());
            if (hits > bestHits) {
                best = rule;
                bestHits = hits;
            }
        }
        return Optional.ofNullable(best);
    }

    /** Counts keywords that occur at the start of a word (so "ear" does not match "heart"). */
    private static int countHits(String text, List<String> keywords) {
        int hits = 0;
        for (String keyword : keywords) {
            if (Pattern.compile("\\b" + Pattern.quote(keyword)).matcher(text).find()) {
                hits++;
            }
        }
        return hits;
    }

    private static boolean specializationMatches(String specialization, List<String> stems) {
        if (specialization == null) {
            return false;
        }
        String s = specialization.toLowerCase(Locale.ROOT).trim();
        for (String stem : stems) {
            // Very short stems (e.g. "ent") must match exactly to avoid false positives.
            if (stem.length() <= 3 ? s.equals(stem) : s.contains(stem)) {
                return true;
            }
        }
        return false;
    }

    private static boolean isOperating(FacilityDto facility) {
        String status = facility.getOperatingStatus();
        return status == null || !NON_OPERATING_STATUSES.contains(status.trim().toUpperCase(Locale.ROOT));
    }

    private static boolean isHospital(FacilityDto facility) {
        return "DISTRICT_HOSPITAL".equalsIgnoreCase(facility.getType())
                || "SPECIALIST_HOSPITAL".equalsIgnoreCase(facility.getType());
    }

    private static Double distanceTo(RecommendationRequest request, FacilityDto facility) {
        return GeoUtils.distanceKm(request.getLatitude(), request.getLongitude(),
                facility.getLatitude(), facility.getLongitude());
    }

    private static int score(int base, Double distanceKm, boolean hospitalBonus) {
        double proximity = distanceKm == null ? 10 : Math.max(0, 25 - distanceKm / 4.0);
        double bonus = hospitalBonus ? 5 : 0;
        return (int) Math.min(99, Math.round(base + proximity + bonus));
    }

    private static String distanceText(Double distanceKm) {
        return distanceKm == null ? "" : String.format(Locale.ROOT, ", about %.1f km away", distanceKm);
    }
}