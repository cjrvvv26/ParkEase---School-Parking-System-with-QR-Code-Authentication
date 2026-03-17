import api from './api';

export const getData = (token) => api.get(`user/token/${token}`);
export const login = (data) => api.post('auth/sign-in', { ...data });
export const verifyOtp = (data) => api.post('auth/verify-otp', { ...data });
export const resendOtp = (data) => api.post('auth/resend-otp', { ...data });
export const updateProfile = (data) => api.patch('user/me', data);
