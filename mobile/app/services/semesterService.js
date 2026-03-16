import api from './api';

export const getSemester = () => {
  const semester = api.get('semester/current');
  console.log(semester);

  return semester;
};
