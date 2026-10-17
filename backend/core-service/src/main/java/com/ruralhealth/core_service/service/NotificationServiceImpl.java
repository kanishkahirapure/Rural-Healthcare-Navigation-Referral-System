package com.ruralhealth.core_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ruralhealth.core_service.dto.NotificationResponse;
import com.ruralhealth.core_service.exception.ResourceNotFoundException;
import com.ruralhealth.core_service.model.Notification;
import com.ruralhealth.core_service.model.Notification.NotificationType;
import com.ruralhealth.core_service.repository.NotificationQueryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationQueryRepository notificationRepository;

    @Override
    @Transactional
    public NotificationResponse create(Long userId, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);
        log.info("Notification {} ({}) created for user {}", saved.getId(), type, userId);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getByUser(Long userId) {
        return notificationRepository.findAllForUser(userId).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnread(Long userId) {
        return notificationRepository.findUnreadForUser(userId).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Override
    @Transactional
    public int markAllAsRead(Long userId) {
        int updated = notificationRepository.markAllReadForUser(userId);
        log.info("Marked {} notification(s) as read for user {}", updated, userId);
        return updated;
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .message(n.getMessage())
                .type(n.getType() == null ? null : n.getType().name())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}