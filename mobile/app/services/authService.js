import api from './api';

export const getData = (token) => {
  return api.get(`user/token/${token}`);
};

export const login = (data) => {
  return api.post('auth/sign-in', { ...data });
};

export const verifyOtp = (data) => {
  return api.post('auth/verify-otp', { ...data });
};

export const resendOtp = (data) => {
  return api.post('auth/resend-otp', { ...data });
};
