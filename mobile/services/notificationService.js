import api from './api';

export const getNotifications = (
  userId,
  { page = 1, limit = 20, type = 'all' } = {},
) => api.get('notifications', { params: { userId, page, limit, type } });

export const markAsRead = (id) => api.put(`notifications/${id}/read`);

export const deleteNotification = (id) => api.delete(`notifications/${id}`);
