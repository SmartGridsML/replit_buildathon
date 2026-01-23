import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONT, RADIUS } from '../theme';

interface FocusCardProps {
  mantra: string;
  subtitle?: string;
  variant?: 'pre' | 'post';
}

export default function FocusCard({ mantra, subtitle, variant = 'pre' }: FocusCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 10,
        bounciness: 4,
      }),
    ]).start();
  }, []);

  const isPre = variant === 'pre';

  return (
    <Animated.View 
      style={[
        styles.container,
        isPre ? styles.containerPre : styles.containerPost,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.dots}>
        <View style={[styles.dot, isPre ? styles.dotPre : styles.dotPost]} />
        <View style={[styles.dot, isPre ? styles.dotPre : styles.dotPost]} />
        <View style={[styles.dot, isPre ? styles.dotPre : styles.dotPost]} />
      </View>
      <Text style={[styles.mantra, !isPre && styles.mantraPost]}>
        {mantra}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, !isPre && styles.subtitlePost]}>
          {subtitle}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerPre: {
    backgroundColor: COLORS.accent,
  },
  containerPost: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotPre: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotPost: {
    backgroundColor: COLORS.success,
  },
  mantra: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: FONT.heading,
  },
  mantraPost: {
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: FONT.body,
  },
  subtitlePost: {
    color: COLORS.textSecondary,
  },
});
