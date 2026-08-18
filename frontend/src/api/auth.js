import { apiClient } from './client';
import { mockUsers } from '../data/users';

export async function login(credentials) {
  return apiClient.post('/auth/login', credentials, (payload) => {
    const { email, password, role = 'family_rep' } = payload;
    
    // Check if user exists in mock or simulate default user
    let user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      if (role === 'admin' || email.includes('admin')) {
        user = mockUsers.find(u => u.role === 'admin');
      } else {
        user = mockUsers.find(u => u.role === 'family_rep');
      }
    }

    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('ataa_auth_token', token);
    localStorage.setItem('ataa_user', JSON.stringify(user));
    
    return { token, user };
  });
}

export async function registerFamily(data) {
  return apiClient.post('/auth/register-family', data, (payload) => {
    const newUser = {
      id: `usr-rep-${Date.now()}`,
      name: payload.name || 'ممثل أسرة جديد',
      email: payload.email,
      role: 'family_rep',
      familyId: `fam-new-${Date.now()}`,
      phone: payload.phone,
      nationalId: payload.nationalId,
      verified: false,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('ataa_auth_token', token);
    localStorage.setItem('ataa_user', JSON.stringify(newUser));
    return { token, user: newUser };
  });
}

export async function logout() {
  localStorage.removeItem('ataa_auth_token');
  localStorage.removeItem('ataa_user');
  return { success: true };
}

export async function getProfile() {
  return apiClient.get('/auth/me', () => {
    const saved = localStorage.getItem('ataa_user');
    if (saved) return JSON.parse(saved);
    return mockUsers[0];
  });
}

export async function updateProfile(data) {
  return apiClient.put('/auth/me', data, (payload) => {
    const saved = localStorage.getItem('ataa_user');
    const current = saved ? JSON.parse(saved) : mockUsers[0];
    const updated = { ...current, ...payload };
    localStorage.setItem('ataa_user', JSON.stringify(updated));
    return updated;
  });
}
