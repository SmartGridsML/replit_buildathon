import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { WeeklyPlan, Workout } from '../types';
import { STORAGE_KEYS } from '../data/storage';
import { EXERCISES } from '../data/exercises';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
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
    .join(' • ');
  return names;
}

function pickTodaysWorkout(plan: WeeklyPlan | null): Workout | null {
  if (!plan || plan.workouts.length === 0) {
    return null;
  }

  const todayLabel = DAY_MAP[new Date().getDay()];
  return plan.workouts.find((workout) => workout.dayLabel === todayLabel) || plan.workouts[0];
}

export default function Home() {
  const navigation = useNavigation();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);

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
      <ScrollView style={styles.root} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>FitForm</Text>
          <Text style={styles.subtitle}>Stay healthy and strong</Text>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.illustrationContainer}>
            <View style={styles.fitnessIllustration}>
              <Text style={styles.illustrationEmoji}>💪</Text>
            </View>
          </View>
        </View>

        <View style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <Text style={styles.todayLabel}>Today's Workout</Text>
            <Text style={styles.todayDay}>{todayWorkout?.dayLabel || 'Get Started'}</Text>
          </View>
          <Text style={styles.todayTitle}>{todayWorkout?.title || 'Morning Workout'}</Text>
          <Text style={styles.todayExercises}>
            {todayWorkout ? getWorkoutLabel(todayWorkout) : 'Complete onboarding to see your plan'}
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('FormCoach' as never)}
        >
          <Text style={styles.primaryButtonText}>Start Workout</Text>
        </Pressable>

        <View style={styles.quickActions}>
          <Pressable
            style={styles.actionCard}
            onPress={() => navigation.navigate('Plan' as never)}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionLabel}>Weekly Plan</Text>
          </Pressable>
          <Pressable
            style={styles.actionCard}
            onPress={() => navigation.navigate('Library' as never)}
          >
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionLabel}>Exercise Library</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fitnessIllustration: {
    width: 180,
    height: 180,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  todayCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  todayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todayDay: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 8,
  },
  todayExercises: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.md,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.body,
  },
});
