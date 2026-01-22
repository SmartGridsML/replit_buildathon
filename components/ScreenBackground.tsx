import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'alt';
}

export default function ScreenBackground({ children, variant = 'default' }: ScreenBackgroundProps) {
  return (
    <View style={[styles.root, variant === 'alt' && styles.alt]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  alt: {
    backgroundColor: COLORS.backgroundAlt,
  },
});
