import api from './api';

export const getOccupiedSlotLocation = (id) => {
  const data = api.get(`slot/your-slot/${id}`);
  console.log(data);

  return data;
};

export const getAvailableSlots = () => {
  const slots = api.get('slot/available');
  console.log(slots);
  return slots;
};

export const verifyScannedSlot = (data) => {
  return api.post('slot/verify-scan', data);
};

export const guardScan = (data) => {
  return api.post('slot/guard-scan', data);
};
