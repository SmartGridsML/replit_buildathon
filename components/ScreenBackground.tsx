import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENT } from '../theme';

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

export default function ScreenBackground({ children }: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFillObject} />
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />
      <View style={styles.scanline} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.accent,
    opacity: 0.18,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -140,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.accentStrong,
    opacity: 0.12,
  },
  scanline: {
    position: 'absolute',
    top: 140,
    left: -120,
    width: 380,
    height: 1,
    backgroundColor: 'rgba(44, 230, 193, 0.18)',
    transform: [{ rotate: '-12deg' }],
  },
});
