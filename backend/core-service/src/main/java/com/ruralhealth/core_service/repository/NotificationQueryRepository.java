package com.ruralhealth.core_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ruralhealth.core_service.model.Notification;

public interface NotificationQueryRepository extends JpaRepository<Notification, Long> {

    @Query("select n from Notification n where n.userId = :userId order by n.createdAt desc")
    List<Notification> findAllForUser(@Param("userId") Long userId);

    @Query("select n from Notification n where n.userId = :userId and n.isRead = false order by n.createdAt desc")
    List<Notification> findUnreadForUser(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true)
    @Query("update Notification n set n.isRead = true where n.userId = :userId and n.isRead = false")
    int markAllReadForUser(@Param("userId") Long userId);
}