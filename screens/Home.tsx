import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserProfile, WeeklyPlan, Workout } from '../types';
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.profile);
        const storedPlan = await AsyncStorage.getItem(STORAGE_KEYS.plan);
        const storedCompleted = await AsyncStorage.getItem(STORAGE_KEYS.completed);
        
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
        
        if (storedPlan) {
          const planData = JSON.parse(storedPlan);
          setPlan(planData);
          
          if (storedCompleted) {
            const completed = JSON.parse(storedCompleted);
            setCompletedCount(completed.length);
            setStreak(calculateStreak(completed));
            
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            weekStart.setHours(0, 0, 0, 0);
            
            const thisWeekWorkouts = completed.filter((w: any) => 
              new Date(w.completedAt).getTime() >= weekStart.getTime()
            );
            const weeklyTarget = planData.workouts?.length || 3;
            setWeeklyProgress(Math.min(thisWeekWorkouts.length / weeklyTarget, 1));
          }
        }
      };
      loadData();
    }, [])
  );

  const todayWorkout = pickTodaysWorkout(plan);
  const userName = profile?.name || 'there';

  return (
    <ScreenBackground>
      <ScrollView style={styles.root} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi {userName} 👋</Text>
          <Text style={styles.subGreeting}>{getGreeting()}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
        </View>

        <View style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.weeklyTitle}>Weekly Progress</Text>
            <Text style={styles.weeklyPercent}>{Math.round(weeklyProgress * 100)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${weeklyProgress * 100}%` }]} />
          </View>
          <Text style={styles.weeklySubtext}>
            {plan ? `${Math.round(weeklyProgress * (plan.workouts?.length || 3))} of ${plan.workouts?.length || 3} workouts this week` : 'Start your first workout!'}
          </Text>
        </View>

        <View style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <Text style={styles.todayLabel}>Today's Workout</Text>
            <Text style={styles.todayDay}>{todayWorkout?.dayLabel || 'Ready'}</Text>
          </View>
          <Text style={styles.todayTitle}>{todayWorkout?.title || 'Get Started'}</Text>
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

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Quick Tip</Text>
            <Text style={styles.tipText}>
              Consistency beats intensity. Even a 15-minute workout is better than skipping entirely.
            </Text>
          </View>
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
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  weeklyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  weeklyPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
    fontFamily: FONT.heading,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
  weeklySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
  },
  todayCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 20,
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
  tipCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 19,
  },
});
