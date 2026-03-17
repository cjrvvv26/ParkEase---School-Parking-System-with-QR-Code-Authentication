import api from './api';

export const getSuperAdminId = () => api.get('super-admin/id');

export const getChatMessages = (chatId) => api.get(`super-admin/chat/${chatId}`);
