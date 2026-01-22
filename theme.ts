import { Platform } from 'react-native';

export const COLORS = {
  background: '#FFFFFF',
  backgroundAlt: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F5F5',
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  accent: '#1A1A1A',
  accentSoft: '#333333',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  textLight: '#CCCCCC',
  white: '#FFFFFF',
  black: '#000000',
  success: '#22C55E',
  successLight: '#DCFCE7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
};

export const FONT = {
  heading: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'system-ui',
  }),
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'system-ui',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const RADIUS = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
};
