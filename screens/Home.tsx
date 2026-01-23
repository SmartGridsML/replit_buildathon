import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserProfile, WeeklyPlan, Workout } from '../types';
import { STORAGE_KEYS } from '../data/storage';
import { EXERCISES } from '../data/exercises';
import { loadUserStats, getLevelFromXP, UserStats } from '../data/gamification';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import AnimatedPressable from '../components/AnimatedPressable';

const CONTENT_LINKS = [
  { 
    id: 'spotify',
    title: 'Workout Playlist',
    subtitle: 'Get pumped with beats',
    icon: '🎵',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
    color: '#1DB954',
  },
  { 
    id: 'youtube',
    title: 'Form Tutorials',
    subtitle: 'Watch and learn',
    icon: '📺',
    url: 'https://www.youtube.com/results?search_query=proper+exercise+form+tutorial',
    color: '#FF0000',
  },
];

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
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [levelInfo, setLevelInfo] = useState({ level: 1, title: 'Beginner', progress: 0, nextLevelXP: 100 });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const heroScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
      Animated.spring(heroScale, {
        toValue: 1,
        delay: 150,
        useNativeDriver: true,
        speed: 10,
        bounciness: 8,
      }),
    ]).start();
  }, []);

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

  const exerciseChips = todayWorkout?.exerciseIds.slice(0, 4).map(id => 
    EXERCISES.find(e => e.id === id)?.name || id
  ) || [];

  return (
    <ScreenBackground>
      <Animated.ScrollView 
        style={[styles.root, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} 
        contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 20) + 40 }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greeting}>Hi {userName} 👋</Text>
              <Text style={styles.subGreeting}>{getGreeting()}</Text>
            </View>
            <AnimatedPressable 
              style={styles.levelBadge}
              onPress={() => (navigation as any).navigate('Achievements')}
              accessibilityLabel={`Level ${levelInfo.level}, ${stats?.totalXP || 0} XP. Tap to view achievements`}
              accessibilityRole="button"
            >
              <Text style={styles.levelNumber}>{levelInfo.level}</Text>
              <Text style={styles.levelXP}>{stats?.totalXP || 0} XP</Text>
            </AnimatedPressable>
          </View>
        </View>

        <AnimatedPressable 
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
        </AnimatedPressable>

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

        <Animated.View style={[styles.heroCard, { transform: [{ scale: heroScale }] }]}>
          <View style={styles.heroHeader}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>TODAY</Text>
            </View>
            <Text style={styles.heroDay}>{todayWorkout?.dayLabel || 'Ready'}</Text>
          </View>
          <Text style={styles.heroTitle}>{todayWorkout?.title || 'Get Started'}</Text>
          {exerciseChips.length > 0 && (
            <View style={styles.chipRow}>
              {exerciseChips.map((name, i) => (
                <View key={i} style={styles.exerciseChip}>
                  <Text style={styles.chipText}>{name}</Text>
                </View>
              ))}
              {(todayWorkout?.exerciseIds.length || 0) > 4 && (
                <View style={styles.exerciseChip}>
                  <Text style={styles.chipText}>+{(todayWorkout?.exerciseIds.length || 0) - 4}</Text>
                </View>
              )}
            </View>
          )}
          {!todayWorkout && (
            <Text style={styles.heroSubtext}>Complete onboarding to see your plan</Text>
          )}
        </Animated.View>

        <AnimatedPressable
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
        </AnimatedPressable>

        <View style={styles.contentSection}>
          <Text style={styles.sectionLabel}>Get Inspired</Text>
          <View style={styles.contentRow}>
            {CONTENT_LINKS.map(link => (
              <AnimatedPressable
                key={link.id}
                style={styles.contentCard}
                onPress={() => Linking.openURL(link.url)}
                accessibilityLabel={`Open ${link.title}`}
                accessibilityRole="link"
              >
                <View style={[styles.contentIcon, { backgroundColor: link.color + '15' }]}>
                  <Text style={styles.contentIconText}>{link.icon}</Text>
                </View>
                <Text style={styles.contentTitle}>{link.title}</Text>
                <Text style={styles.contentSubtitle}>{link.subtitle}</Text>
              </AnimatedPressable>
            ))}
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Quick Tip</Text>
            <Text style={styles.tipText}>
              Consistency beats intensity. Even a 15-minute workout is better than skipping entirely.
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
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
    paddingBottom: 100,
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
  heroCard: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.xl,
    padding: 24,
    marginBottom: 16,
    ...SHADOWS.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  heroBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroDay: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: FONT.heading,
    marginBottom: 16,
  },
  heroSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONT.body,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  contentSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  contentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contentIconText: {
    fontSize: 22,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 2,
  },
  contentSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
  },
});
