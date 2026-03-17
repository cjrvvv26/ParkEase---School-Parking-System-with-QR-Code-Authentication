import api from './api';

export const getData = (token) => {
  console.log(token);

  const user = api.get(`user/token/${token}`);
  console.log(user);
  return user;
};

export const login = (data) => {
  const user = api.post('auth/sign-in', { ...data });
  console.log(user);

  return user;
};

export const verifyOtp = (data) => {
  const user = api.post('auth/verify-otp', { ...data });
  console.log(user);

  return user;
};

export const resendOtp = (data) => {
  return api.post('auth/resend-otp', { ...data });
};
