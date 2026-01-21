import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { WeeklyPlan, UserProfile, Workout } from '../types';
import { STORAGE_KEYS } from '../data/storage';
import { generateWeeklyPlan } from '../data/planGenerator';
import PlanCard from '../components/PlanCard';
import { EXERCISES } from '../data/exercises';
import { COLORS, FONT, RADIUS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

function getExerciseNames(workout: Workout) {
  return workout.exerciseIds
    .map((id) => EXERCISES.find((exercise) => exercise.id === id)?.name || id)
    .join(' | ');
}

const DAY_MAP: Record<number, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

function pickTodaysWorkout(plan: WeeklyPlan | null): Workout | null {
  if (!plan || plan.workouts.length === 0) {
    return null;
  }
  const todayLabel = DAY_MAP[new Date().getDay()];
  return plan.workouts.find((workout) => workout.dayLabel === todayLabel) || plan.workouts[0];
}

export default function Plan() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const todayWorkout = pickTodaysWorkout(plan);

  const loadData = useCallback(async () => {
    const storedPlan = await AsyncStorage.getItem(STORAGE_KEYS.plan);
    const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.profile);

    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    }

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const regeneratePlan = async () => {
    if (!profile) {
      return;
    }
    const newPlan = generateWeeklyPlan(profile);
    await AsyncStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(newPlan));
    setPlan(newPlan);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Weekly Plan</Text>
        <Text style={styles.subtitle}>Simple structure you can follow this week.</Text>

        {todayWorkout && (
          <View style={styles.todayCard}>
            <Text style={styles.todayLabel}>Today</Text>
            <Text style={styles.todayTitle}>{todayWorkout.title}</Text>
            <Text style={styles.todayDetail}>{getExerciseNames(todayWorkout)}</Text>
          </View>
        )}

      {plan?.workouts.length ? (
        plan.workouts.map((workout) => (
          <PlanCard
            key={workout.id}
            workout={workout}
            exerciseLabels={getExerciseNames(workout)}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>Complete onboarding to see your plan.</Text>
      )}

        <Pressable style={styles.regen} onPress={regeneratePlan}>
          <Text style={styles.regenText}>Regenerate Plan</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    paddingTop: 36,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    fontFamily: FONT.heading,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginBottom: 16,
    fontFamily: FONT.body,
  },
  regen: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accentStrong,
    backgroundColor: 'transparent',
  },
  regenText: {
    color: COLORS.accentStrong,
    fontWeight: '600',
    fontFamily: FONT.heading,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  todayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  todayLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.textDim,
    fontFamily: FONT.body,
  },
  todayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 6,
    fontFamily: FONT.heading,
  },
  todayDetail: {
    color: COLORS.textMuted,
    marginTop: 6,
    fontFamily: FONT.body,
  },
  emptyText: {
    color: COLORS.textMuted,
    marginVertical: 20,
    fontFamily: FONT.body,
  },
});
