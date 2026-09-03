import { api } from './api';
import { Notification } from '../types/notification';

export const notificationService = {
  getByUser: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data.notifications || response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
