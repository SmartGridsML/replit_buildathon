import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import AnimatedPressable from '../components/AnimatedPressable';

const { width } = Dimensions.get('window');

export default function Landing() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 8,
          bounciness: 4,
        }),
      ]),
      Animated.parallel([
        Animated.timing(taglineFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideUp, {
          toValue: 0,
          useNativeDriver: true,
          speed: 10,
          bounciness: 6,
        }),
      ]),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScreenBackground>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.heroSection}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.brandName}>PINNACLE</Text>
          </Animated.View>

          <Animated.View style={{ opacity: taglineFade, transform: [{ translateY: slideUp }] }}>
            <Text style={styles.tagline}>Reach Your Peak</Text>
            <View style={styles.divider} />
            <Text style={styles.subTagline}>Body • Mind • Spirit</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.bottomSection, { opacity: buttonFade }]}>
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💪</Text>
              <Text style={styles.featureText}>Train</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🧠</Text>
              <Text style={styles.featureText}>Learn</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={styles.featureText}>Achieve</Text>
            </View>
          </View>

          <AnimatedPressable
            style={styles.googleButton}
            onPress={() => {
              if (Platform.OS === 'web') {
                window.location.href = '/api/login';
              } else {
                Linking.openURL('/api/login');
              }
            }}
            accessibilityLabel="Sign up with Google"
            accessibilityRole="button"
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Sign up with Google</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.ctaButton}
            onPress={() => (navigation as any).navigate('Onboarding')}
            accessibilityLabel="Continue as guest"
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>Continue as Guest</Text>
          </AnimatedPressable>

          <Text style={styles.footerText}>Your transformation starts here</Text>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 52,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 12,
    fontFamily: FONT.heading,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 22,
    fontWeight: '300',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 2,
    fontFamily: FONT.body,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.accent,
    alignSelf: 'center',
    marginVertical: 20,
  },
  subTagline: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textMuted,
    textAlign: 'center',
    letterSpacing: 4,
    fontFamily: FONT.body,
  },
  bottomSection: {
    paddingBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    fontFamily: FONT.body,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    ...SHADOWS.md,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
  ctaButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: FONT.body,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontFamily: FONT.body,
  },
});
