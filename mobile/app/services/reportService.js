import api from './api';

export const getSystemSummary = () => api.get('report/system-summary');
export const getWeeklyScans = () => api.get('report/weekly-scans');
export const getRecentActivity = () => api.get('report/recent-activity');
export const getAvgParkingByHour = () => api.get('report/avg-parking-by-hour');
