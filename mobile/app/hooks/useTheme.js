import { useSelector } from 'react-redux';

const light = {
  bg: '#f8f7ff',
  bgSecondary: '#f3f4f6',
  card: '#ffffff',
  cardBorder: '#e5e7eb',
  cardBorderActive: '#c4b5fd',
  text: '#0e0e11',
  textMuted: '#71717a',
  textFaint: '#9ca3af',
  inputBg: '#f9fafb',
  divider: '#f3f4f6',
  tabBar: '#ffffff',
  tabBarBorder: '#f0ebff',
  tabIconInactive: '#71717a',
  tabIconActiveBg: '#f0ebff',
  headerBtn: '#ffffff',
  headerBtnBorder: '#e5e7eb',
  skeletonBg: '#f3f4f6',
  filterBar: '#f3f4f6',
  // fixed
  primary: '#8e51ff',
  primaryLight: '#f0ebff',
  primaryBorder: '#c4b5fd',
  green: '#16a34a',
  greenBg: '#dcfce7',
  red: '#dc2626',
  redBg: '#fee2e2',
  amber: '#d97706',
  amberBg: '#fef3c7',
};

const dark = {
  bg: '#0f0a1e',
  bgSecondary: '#1a1030',
  card: '#1c1232',
  cardBorder: '#2d1f4a',
  cardBorderActive: '#6d28d9',
  text: '#f3f0ff',
  textMuted: '#a78bfa',
  textFaint: '#6b7280',
  inputBg: '#160e2a',
  divider: '#2d1f4a',
  tabBar: '#130d24',
  tabBarBorder: '#2d1f4a',
  tabIconInactive: '#6b7280',
  tabIconActiveBg: '#2d1f4a',
  headerBtn: '#1c1232',
  headerBtnBorder: '#2d1f4a',
  skeletonBg: '#2d1f4a',
  filterBar: '#1c1232',
  // fixed
  primary: '#8e51ff',
  primaryLight: '#2d1f4a',
  primaryBorder: '#6d28d9',
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
