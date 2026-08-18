import { apiClient } from './client';
import { mockPlatformData } from '../data/platform';
import { generateId } from '../lib/utils';

export async function getPlatformData() {
  return apiClient.get('/platform', () => {
    return mockPlatformData;
  });
}

export async function getPlatformCosts() {
  return apiClient.get('/platform/costs', () => {
    return mockPlatformData.costs;
  });
}

export async function createPlatformDonation(data) {
  return apiClient.post('/platform/donations', data, (payload) => {
    const refId = generateId('REF-PLAT');
    const newDonation = {
      id: `pld-${Date.now()}`,
      referenceId: refId,
      type: 'platform',
      amount: Number(payload.amount) || 100,
      donorName: payload.isAnonymous ? null : (payload.donorName || 'مشارك كريم'),
      donorEmail: payload.donorEmail || null,
      donorPhone: payload.donorPhone || null,
      paymentMethod: payload.paymentMethod || 'instapay',
      isAnonymous: Boolean(payload.isAnonymous),
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    
    mockPlatformData.currentRaised += newDonation.amount;
    mockPlatformData.donations.unshift(newDonation);
    return newDonation;
  });
}
