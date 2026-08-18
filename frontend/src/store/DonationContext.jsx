import React, { createContext, useContext, useState } from 'react';

const DonationContext = createContext();

const initialDonationState = {
  type: 'family', // 'family' | 'platform'
  family: null,
  service: null,
  amount: 250,
  isAnonymous: true,
  donorName: '',
  donorEmail: '',
  donorPhone: '',
  platformTip: 20,
  includePlatformTip: true,
  paymentMethod: 'instapay',
  referenceId: null,
  status: 'draft',
};

export function DonationProvider({ children }) {
  const [donationState, setDonationState] = useState(initialDonationState);

  const setDonationTarget = ({ family = null, service = null, type = 'family', presetAmount = null }) => {
    setDonationState(prev => ({
      ...prev,
      type,
      family,
      service,
      amount: presetAmount || prev.amount || 250,
    }));
  };

  const updateDonationDetails = (fields) => {
    setDonationState(prev => ({ ...prev, ...fields }));
  };

  const resetDonation = () => {
    setDonationState(initialDonationState);
  };

  return (
    <DonationContext.Provider value={{ donationState, setDonationTarget, updateDonationDetails, resetDonation }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (!context) throw new Error('useDonation must be used within a DonationProvider');
  return context;
}
