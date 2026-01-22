import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserProfile, WeeklyPlan, Workout } from '../types';
import { STORAGE_KEYS } from '../data/storage';
import { EXERCISES } from '../data/exercises';
import { loadUserStats, getLevelFromXP, UserStats } from '../data/gamification';
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
  const [stats, setStats] = useState<UserStats | null>(null);
  const [levelInfo, setLevelInfo] = useState({ level: 1, title: 'Beginner', progress: 0, nextLevelXP: 100 });

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.profile);
        const storedPlan = await AsyncStorage.getItem(STORAGE_KEYS.plan);
        const storedCompleted = await AsyncStorage.getItem(STORAGE_KEYS.completed);
        const userStats = await loadUserStats();
        
        setStats(userStats);
        setLevelInfo(getLevelFromXP(userStats.totalXP));
        
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
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greeting}>Hi {userName} 👋</Text>
              <Text style={styles.subGreeting}>{getGreeting()}</Text>
            </View>
            <Pressable 
              style={styles.levelBadge}
              onPress={() => (navigation as any).navigate('Achievements')}
              accessibilityLabel={`Level ${levelInfo.level}, ${stats?.totalXP || 0} XP. Tap to view achievements`}
              accessibilityRole="button"
            >
              <Text style={styles.levelNumber}>{levelInfo.level}</Text>
              <Text style={styles.levelXP}>{stats?.totalXP || 0} XP</Text>
            </Pressable>
          </View>
        </View>

        <Pressable 
          style={styles.xpCard}
          onPress={() => (navigation as any).navigate('Achievements')}
          accessibilityLabel="View your progress and achievements"
          accessibilityRole="button"
        >
          <View style={styles.xpHeader}>
            <Text style={styles.xpTitle}>{levelInfo.title}</Text>
            <Text style={styles.xpAmount}>{stats?.totalXP || 0} XP</Text>
          </View>
          <View style={styles.xpProgressBg}>
            <View style={[styles.xpProgressFill, { width: `${levelInfo.progress * 100}%` }]} />
          </View>
          <Text style={styles.xpSubtext}>
            {levelInfo.level < 10 
              ? `${levelInfo.nextLevelXP - (stats?.totalXP || 0)} XP to Level ${levelInfo.level + 1}`
              : 'Max Level!'
            }
          </Text>
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak} 🔥</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats?.unlockedAchievements.length || 0}</Text>
            <Text style={styles.statLabel}>Badges</Text>
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
          accessibilityLabel="Start today's workout"
          accessibilityRole="button"
          accessibilityState={{ disabled: !todayWorkout }}
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
    marginBottom: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: FONT.heading,
  },
  levelXP: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT.body,
  },
  xpCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  xpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  xpAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accent,
    fontFamily: FONT.heading,
  },
  xpProgressBg: {
    height: 6,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  xpSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  weeklyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weeklyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  weeklyPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accent,
    fontFamily: FONT.heading,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  weeklySubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
  },
  todayCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todayDay: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 6,
  },
  todayExercises: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 18,
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
    fontSize: 22,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 18,
  },
});
