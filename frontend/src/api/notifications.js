import { apiClient } from './client';
import { mockNotifications } from '../data/notifications';

export async function getNotifications(role = 'all') {
  return apiClient.get('/notifications', () => {
    if (role === 'all') return mockNotifications;
    return mockNotifications.filter(n => n.role === role);
  });
}

export async function markAsRead(id) {
  return apiClient.put(`/notifications/${id}/read`, {}, () => {
    const notif = mockNotifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return { success: true };
  });
}

export async function markAllRead() {
  return apiClient.put('/notifications/mark-all-read', {}, () => {
    mockNotifications.forEach(n => { n.read = true; });
    return { success: true };
  });
}
