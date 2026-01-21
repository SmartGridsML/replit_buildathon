import { Platform } from 'react-native';

export const COLORS = {
  background: '#0B0D0F',
  backgroundAlt: '#121518',
  surface: '#1A1E23',
  surfaceElevated: '#232930',
  border: 'rgba(255, 255, 255, 0.05)',
  accent: '#2CE6C1', // Neon Mint
  accentStrong: '#35F2A6',
  accentGlow: 'rgba(44, 230, 193, 0.4)',
  text: '#FFFFFF',
  textMuted: '#A0AEC0',
  textDim: '#718096',
  chip: 'rgba(44, 230, 193, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.85)',
};

export const GRADIENT = ['#0B0D0F', '#15191E', '#0B0D0F'];

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
  sm: 8,
  md: 12,
  lg: 20,
  xl: 32,
};
