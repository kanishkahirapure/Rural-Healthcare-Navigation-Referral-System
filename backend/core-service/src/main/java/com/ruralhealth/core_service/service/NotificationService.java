package com.ruralhealth.core_service.service;

import java.util.List;

import com.ruralhealth.core_service.dto.NotificationResponse;
import com.ruralhealth.core_service.model.Notification.NotificationType;

public interface NotificationService {

    NotificationResponse create(Long userId, String message, NotificationType type);

    List<NotificationResponse> getByUser(Long userId);

    List<NotificationResponse> getUnread(Long userId);

    NotificationResponse markAsRead(Long id);

    int markAllAsRead(Long userId);
}