import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { WeeklyPlan, Workout } from '../types';
import { STORAGE_KEYS } from '../data/storage';
import { EXERCISES } from '../data/exercises';
import { COLORS, FONT, RADIUS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

const DAY_MAP: Record<number, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

function getWorkoutLabel(workout: Workout) {
  const names = workout.exerciseIds
    .map((id) => EXERCISES.find((exercise) => exercise.id === id)?.name || id)
    .join(' | ');
  return names;
}

function pickTodaysWorkout(plan: WeeklyPlan | null): Workout | null {
  if (!plan || plan.workouts.length === 0) {
    return null;
  }

  const todayLabel = DAY_MAP[new Date().getDay()];
  return plan.workouts.find((workout) => workout.dayLabel === todayLabel) || plan.workouts[0];
}

const PLAYLISTS = [
  {
    label: 'Power Lift',
    url: 'spotify:playlist:37i9dQZF1DX76Wlfdnj7AP',
    fallback: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
  },
  {
    label: 'Focus Flow',
    url: 'spotify:playlist:37i9dQZF1DX4eRPd9frC1m',
    fallback: 'https://open.spotify.com/playlist/37i9dQZF1DX4eRPd9frC1m',
  },
  {
    label: 'Cardio Boost',
    url: 'spotify:playlist:37i9dQZF1DX70RN3TfWWJh',
    fallback: 'https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh',
  },
];

const CONTENT = [
  { label: 'Squat Form Tips', url: 'https://www.youtube.com/watch?v=1oed-UmAxFs' },
  { label: 'Push-Up Cues', url: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
  { label: 'Mobility Warm-Up', url: 'https://www.tiktok.com/@movebetter/video/7195148481860191530' },
];

export default function Home() {
  const navigation = useNavigation();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);

  const openLink = async (url: string, fallback?: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
      return;
    }
    if (fallback) {
      Linking.openURL(fallback);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadPlan = async () => {
        const storedPlan = await AsyncStorage.getItem(STORAGE_KEYS.plan);
        if (storedPlan) {
          setPlan(JSON.parse(storedPlan));
        }
      };

      loadPlan();
    }, [])
  );

  const todayWorkout = pickTodaysWorkout(plan);

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Your next workout keeps you consistent.</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Today</Text>
        <Text style={styles.cardTitle}>{todayWorkout?.title || 'Build your plan'}</Text>
        <Text style={styles.cardDetail}>
          {todayWorkout ? getWorkoutLabel(todayWorkout) : 'Finish onboarding to get started.'}
        </Text>
      </View>

      <Pressable
        style={styles.primary}
        onPress={() => navigation.navigate('FormCoach' as never)}
      >
        <Text style={styles.primaryText}>Start Form Coach</Text>
      </Pressable>

      <Pressable
        style={styles.secondary}
        onPress={() => navigation.navigate('Plan' as never)}
      >
        <Text style={styles.secondaryText}>View Weekly Plan</Text>
      </Pressable>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Soundtrack</Text>
          <View style={styles.linkRow}>
            {PLAYLISTS.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => openLink(item.url, item.fallback)}
                style={styles.linkChip}
              >
                <Text style={styles.linkText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Learn & Move</Text>
          <View style={styles.linkRow}>
            {CONTENT.map((item) => (
              <Pressable key={item.label} onPress={() => openLink(item.url)} style={styles.linkChip}>
                <Text style={styles.linkText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 36,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    fontFamily: FONT.heading,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginBottom: 24,
    fontFamily: FONT.body,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  cardLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.textDim,
    fontFamily: FONT.body,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
    fontFamily: FONT.heading,
  },
  cardDetail: {
    color: COLORS.textMuted,
    marginTop: 6,
    fontFamily: FONT.body,
  },
  primary: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  primaryText: {
    color: COLORS.background,
    fontWeight: '600',
    fontFamily: FONT.heading,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondary: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.text,
    fontWeight: '600',
    fontFamily: FONT.heading,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionBlock: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    fontFamily: FONT.heading,
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkChip: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  linkText: {
    color: COLORS.accentStrong,
    fontFamily: FONT.body,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
