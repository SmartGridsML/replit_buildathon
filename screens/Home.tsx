import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
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
    .slice(0, 3)
    .join(' • ');
  return names + (workout.exerciseIds.length > 3 ? '...' : '');
}

function pickTodaysWorkout(plan: WeeklyPlan | null): Workout | null {
  if (!plan || plan.workouts.length === 0) {
    return null;
  }

  const todayLabel = DAY_MAP[new Date().getDay()];
  return plan.workouts.find((workout) => workout.dayLabel === todayLabel) || plan.workouts[0];
}

function calculateStreak(completedWorkouts: any[]): number {
  if (!completedWorkouts || completedWorkouts.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sortedDates = completedWorkouts
    .map(w => {
      const d = new Date(w.completedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => b - a);

  let streak = 0;
  let checkDate = today.getTime();

  for (const date of sortedDates) {
    if (date === checkDate || date === checkDate - 86400000) {
      streak++;
      checkDate = date;
    } else if (date < checkDate - 86400000) {
      break;
    }
  }

  return streak;
}

export default function Home() {
  const navigation = useNavigation();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const storedPlan = await AsyncStorage.getItem(STORAGE_KEYS.plan);
        const storedCompleted = await AsyncStorage.getItem(STORAGE_KEYS.completed);
        
        if (storedPlan) {
          setPlan(JSON.parse(storedPlan));
        }
        
        if (storedCompleted) {
          const completed = JSON.parse(storedCompleted);
          setCompletedCount(completed.length);
          setStreak(calculateStreak(completed));
        }
      };
      loadData();
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

        <View style={styles.progressRow}>
          <View style={styles.progressCard}>
            <Text style={styles.progressValue}>{completedCount}</Text>
            <Text style={styles.progressLabel}>Workouts</Text>
          </View>
          <View style={styles.progressCard}>
            <Text style={styles.progressValue}>{streak}</Text>
            <Text style={styles.progressLabel}>Day Streak</Text>
          </View>
          <View style={styles.progressCard}>
            <Text style={styles.progressValue}>💪</Text>
            <Text style={styles.progressLabel}>Keep Going</Text>
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
          style={[styles.primaryButton, !todayWorkout && styles.buttonDisabled]}
          onPress={() => {
            if (todayWorkout) {
              (navigation as any).navigate('WorkoutSession', { workout: todayWorkout });
            }
          }}
          disabled={!todayWorkout}
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
    marginBottom: 24,
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
  progressRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  progressCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  progressLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  buttonDisabled: {
    opacity: 0.4,
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
