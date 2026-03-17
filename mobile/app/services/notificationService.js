import api from './api';

export const getNotifications = (userId, { page = 1, limit = 20, type = 'all' } = {}) =>
  api.get('notification', { params: { userId, page, limit, type } });

export const markAsRead = (id) => api.put(`notification/${id}/read`);

export const deleteNotification = (id) => api.delete(`notification/${id}`);
