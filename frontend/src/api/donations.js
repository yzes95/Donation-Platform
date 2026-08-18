import { apiClient } from './client';
import { mockDonations } from '../data/donations';
import { mockFamilies } from '../data/families';
import { mockServices } from '../data/services';
import { generateId } from '../lib/utils';

export async function createDonation(data) {
  return apiClient.post('/donations', data, (payload) => {
    const refId = generateId('REF-ATAA');
    const newDonation = {
      id: `don-${Date.now()}`,
      referenceId: refId,
      type: payload.type || 'family',
      familyId: payload.familyId || null,
      familyName: payload.familyName || (payload.familyId ? mockFamilies.find(f => f.id === payload.familyId)?.nameAr : null),
      serviceId: payload.serviceId || null,
      serviceTitle: payload.serviceTitle || (payload.serviceId ? mockServices.find(s => s.id === payload.serviceId)?.titleAr : null),
      amount: Number(payload.amount) || 100,
      platformTip: Number(payload.platformTip) || 0,
      totalPaid: (Number(payload.amount) || 100) + (Number(payload.platformTip) || 0),
      isAnonymous: Boolean(payload.isAnonymous),
      donorName: payload.isAnonymous ? null : (payload.donorName || 'مشارك كريم'),
      donorEmail: payload.donorEmail || null,
      donorPhone: payload.donorPhone || null,
      paymentMethod: payload.paymentMethod || 'instapay',
      status: 'processing',
      createdAt: new Date().toISOString(),
    };
    
    mockDonations.unshift(newDonation);
    return newDonation;
  });
}

export async function getDonation(idOrRef) {
  return apiClient.get(`/donations/${idOrRef}`, () => {
    const item = mockDonations.find(d => d.id === idOrRef || d.referenceId === idOrRef);
    if (!item) throw new Error('Donation record not found');
    return item;
  });
}

export async function trackDonation(reference) {
  return apiClient.get(`/donations/track/${reference}`, () => {
    const cleanRef = reference.trim().toUpperCase();
    const item = mockDonations.find(d => d.referenceId.toUpperCase() === cleanRef || d.id === reference);
    if (!item) throw new Error('Reference not found');
    return item;
  });
}

export async function getDonationHistory(familyId) {
  return apiClient.get(`/families/${familyId}/donations`, () => {
    return mockDonations.filter(d => d.familyId === familyId);
  });
}

export async function getAllDonations(filters = {}) {
  return apiClient.get('/donations', () => {
    let list = [...mockDonations];
    if (filters.type && filters.type !== 'all') {
      list = list.filter(d => d.type === filters.type);
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(d => d.status === filters.status);
    }
    return list;
  });
}
