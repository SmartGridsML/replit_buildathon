import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { WeeklyPlan, UserProfile, Workout } from '../types';
import { STORAGE_KEYS } from '../data/storage';
import { generateWeeklyPlan } from '../data/planGenerator';
import PlanCard from '../components/PlanCard';
import { EXERCISES } from '../data/exercises';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

function getExerciseNames(workout: Workout) {
  return workout.exerciseIds
    .map((id) => EXERCISES.find((exercise) => exercise.id === id)?.name || id)
    .join(' • ');
}

export default function Plan() {
  const navigation = useNavigation();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadData = useCallback(async () => {
    const storedPlan = await AsyncStorage.getItem(STORAGE_KEYS.plan);
    const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.profile);
    if (storedPlan) setPlan(JSON.parse(storedPlan));
    if (storedProfile) setProfile(JSON.parse(storedProfile));
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const regeneratePlan = async () => {
    if (!profile) return;
    const newPlan = generateWeeklyPlan(profile);
    await AsyncStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(newPlan));
    setPlan(newPlan);
  };

  const startWorkout = (workout: Workout) => {
    (navigation as any).navigate('WorkoutSession', { workout });
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Plan</Text>
          <Text style={styles.subtitle}>Your personalized workout schedule</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Experience</Text>
            <Text style={styles.statValue}>{profile?.experience || '—'}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Goal</Text>
            <Text style={styles.statValue}>{profile?.goal || '—'}</Text>
          </View>
        </View>

        {plan?.workouts.length ? (
          <View style={styles.list}>
            {plan.workouts.map((workout) => (
              <PlanCard
                key={workout.id}
                workout={workout}
                exerciseLabels={getExerciseNames(workout)}
                onStart={() => startWorkout(workout)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No workout plan yet</Text>
            <Text style={styles.emptySubtext}>Complete onboarding to generate your plan</Text>
          </View>
        )}

        <Pressable style={styles.regenButton} onPress={regeneratePlan}>
          <Text style={styles.regenText}>Regenerate Plan</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700',
    fontFamily: FONT.heading,
    textTransform: 'capitalize',
  },
  list: {
    marginBottom: 24,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: COLORS.text,
    fontFamily: FONT.heading,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    fontSize: 14,
  },
  regenButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  regenText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
});
