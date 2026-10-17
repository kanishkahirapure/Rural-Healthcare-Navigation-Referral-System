package com.ruralhealth.ai_service.util;

/** Geographic helper methods. */
public final class GeoUtils {

    private static final double EARTH_RADIUS_KM = 6371.0088;

    private GeoUtils() {
    }

    /**
     * Great-circle distance (haversine) in kilometres.
     *
     * @return distance in km, or null if any coordinate is missing
     */
    public static Double distanceKm(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return null;
        }
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}