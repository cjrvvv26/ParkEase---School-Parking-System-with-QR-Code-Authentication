import api from './api';

export const login = (data) => {
  const user = api.post('auth/sign-in', { ...data });
  console.log(user);

  return user;
};
