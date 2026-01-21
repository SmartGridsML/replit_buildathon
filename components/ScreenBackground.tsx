import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENT } from '../theme';

const { width, height } = Dimensions.get('window');

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

export default function ScreenBackground({ children }: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={GRADIENT as [string, string, ...string[]]} style={StyleSheet.absoluteFillObject} />
      
      {/* Dynamic Glow Elements */}
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowRight} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />
      
      {/* Tech Overlay Details */}
      <View style={styles.gridOverlay} pointerEvents="none" />
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
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: COLORS.accent,
    opacity: 0.08,
  },
  glowRight: {
    position: 'absolute',
    top: height * 0.2,
    right: -width * 0.3,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: COLORS.accentStrong,
    opacity: 0.05,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -height * 0.1,
    left: -width * 0.1,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: COLORS.accent,
    opacity: 0.06,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: COLORS.text,
  },
  scanline: {
    position: 'absolute',
    top: '15%',
    left: -width,
    width: width * 3,
    height: 1,
    backgroundColor: 'rgba(44, 230, 193, 0.12)',
    transform: [{ rotate: '-15deg' }],
  },
});
