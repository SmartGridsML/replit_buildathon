import { Platform } from 'react-native';

export const COLORS = {
  background: '#0B0E12',
  backgroundAlt: '#11161C',
  surface: '#151B21',
  surfaceElevated: '#1B222A',
  border: 'rgba(255, 255, 255, 0.08)',
  accent: '#2CE6C1',
  accentStrong: '#35F2A6',
  text: '#F5F7FA',
  textMuted: '#9AA4AE',
  textDim: '#6E7781',
  chip: 'rgba(255, 255, 255, 0.08)',
  overlay: 'rgba(6, 8, 10, 0.7)',
};

export const GRADIENT = ['#0B0E12', '#111820', '#0D1217'];

export const FONT = {
  heading: Platform.select({
    ios: 'AvenirNext-CondensedBold',
    android: 'sans-serif-condensed',
    default: 'sans-serif-condensed',
  }),
  body: Platform.select({
    ios: 'AvenirNext-Medium',
    android: 'sans-serif',
    default: 'sans-serif',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
};
