import client from "./client";

// All notifications of a user.
export async function getNotifications(userId) {
  const response = await client.get(`/api/notifications/user/${userId}`);
  return response.data.data;
}

// Only the unread notifications of a user.
export async function getUnreadNotifications(userId) {
  const response = await client.get(`/api/notifications/user/${userId}/unread`);
  return response.data.data;
}

// Mark one notification as read.
export async function markNotificationRead(id) {
  const response = await client.patch(`/api/notifications/${id}/read`);
  return response.data.data;
}

// Mark all notifications of a user as read.
export async function markAllNotificationsRead(userId) {
  const response = await client.patch(`/api/notifications/user/${userId}/read-all`);
  return response.data.data;
}
