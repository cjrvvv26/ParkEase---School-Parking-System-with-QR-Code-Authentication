import api from './api';

export const getAvailableSlots = () => {
  const slots = api.get('slot/available');
  console.log(slots);
  return slots;
};

export const verifyScannedSlot = (data) => {
  const slot = api.post('/slot/verify-scan', data);
  console.log(slot);

  return slot;
};
