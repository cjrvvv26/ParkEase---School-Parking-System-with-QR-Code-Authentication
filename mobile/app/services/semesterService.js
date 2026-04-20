import api from './api';

export const getSemester = async () => {
  const semester = await api.get('semester/current');
  return semester;
};
