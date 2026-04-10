import { useSelector } from 'react-redux';

const light = {
  bg: '#f0f7ff',
  bgSecondary: '#f3f4f6',
  card: '#ffffff',
  cardBorder: '#e5e7eb',
  cardBorderActive: '#93c5fd',
  text: '#0e0e11',
  textMuted: '#71717a',
  textFaint: '#9ca3af',
  inputBg: '#f9fafb',
  divider: '#f3f4f6',
  tabBar: '#ffffff',
  tabBarBorder: '#dbeafe',
  tabIconInactive: '#71717a',
  tabIconActiveBg: '#dbeafe',
  headerBtn: '#ffffff',
  headerBtnBorder: '#e5e7eb',
  skeletonBg: '#f3f4f6',
  filterBar: '#f3f4f6',
  // fixed
  primary: '#3b82f6',
  primaryLight: '#dbeafe',
  primaryBorder: '#93c5fd',
  green: '#16a34a',
  greenBg: '#dcfce7',
  red: '#dc2626',
  redBg: '#fee2e2',
  amber: '#d97706',
  amberBg: '#fef3c7',
};

const dark = {
  bg: '#0a0f1e',
  bgSecondary: '#0f1a30',
  card: '#111827',
  cardBorder: '#1e3a5f',
  cardBorderActive: '#1d4ed8',
  text: '#f0f7ff',
  textMuted: '#93c5fd',
  textFaint: '#6b7280',
  inputBg: '#0d1526',
  divider: '#1e3a5f',
  tabBar: '#0d1526',
  tabBarBorder: '#1e3a5f',
  tabIconInactive: '#6b7280',
  tabIconActiveBg: '#1e3a5f',
  headerBtn: '#111827',
  headerBtnBorder: '#1e3a5f',
  skeletonBg: '#1e3a5f',
  filterBar: '#111827',
  // fixed
  primary: '#3b82f6',
  primaryLight: '#1e3a5f',
  primaryBorder: '#1d4ed8',
  green: '#16a34a',
  greenBg: '#052e16',
  red: '#dc2626',
  redBg: '#2d0a0a',
  amber: '#d97706',
  amberBg: '#2d1a00',
};

export default function useTheme() {
  const mode = useSelector((state) => state.theme.mode);
  return { t: mode === 'dark' ? dark : light, mode };
}
