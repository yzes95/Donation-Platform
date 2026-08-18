import { apiClient } from './client';
import { mockDonations } from '../data/donations';
import { mockPayments } from '../data/payments';
import { delay } from '../lib/utils';

export async function processPayment(paymentData) {
  return apiClient.post('/payments/process', paymentData, (payload) => {
    const newPayment = {
      id: `pay-${Date.now()}`,
      donationId: payload.donationId,
      referenceId: payload.referenceId,
      gateway: payload.gateway || 'instapay',
      amount: payload.amount,
      currency: 'EGP',
      status: 'successful',
      fee: 0,
      payerName: payload.payerName || 'مشارك كريم',
      createdAt: new Date().toISOString(),
      settledAt: new Date().toISOString(),
    };
    
    // Update donation status
    const donation = mockDonations.find(d => d.id === payload.donationId || d.referenceId === payload.referenceId);
    if (donation) {
      donation.status = 'completed';
    }
    
    mockPayments.unshift(newPayment);
    return newPayment;
  });
}

export async function simulatePaymentFlow(donationId, desiredOutcome = 'successful') {
  // Step 1: Pending (300ms)
  await delay(400);
  
  // Step 2: Processing (800ms)
  await delay(800);
  
  // Step 3: Resolution
  const donation = mockDonations.find(d => d.id === donationId || d.referenceId === donationId);
  if (desiredOutcome === 'successful') {
    if (donation) donation.status = 'completed';
    return { status: 'successful', message: 'Payment successfully settled' };
  } else {
    if (donation) donation.status = 'failed';
    return { status: 'failed', message: 'Card declined or insufficient balance' };
  }
}

export async function getPaymentStatus(paymentId) {
  return apiClient.get(`/payments/${paymentId}`, () => {
    const p = mockPayments.find(item => item.id === paymentId || item.referenceId === paymentId);
    if (!p) throw new Error('Payment not found');
    return p;
  });
}
