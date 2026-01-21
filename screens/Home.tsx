import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, ScrollView } from 'react-native';
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
  { label: 'Power', url: 'spotify:playlist:37i9dQZF1DX76Wlfdnj7AP' },
  { label: 'Focus', url: 'spotify:playlist:37i9dQZF1DX4eRPd9frC1m' },
];

const CONTENT = [
  { label: 'Squat Form', url: 'https://www.youtube.com/watch?v=1oed-UmAxFs' },
  { label: 'Push-Up Tips', url: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
];

export default function Home() {
  const navigation = useNavigation();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);

  const openLink = async (url: string) => {
    Linking.openURL(url);
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
      <ScrollView style={styles.root} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>FITFORM</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>READY</Text>
          </View>
        </View>

        <Text style={styles.welcomeText}>Build consistency. Move safely.</Text>

        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>TODAY'S MISSION</Text>
            <View style={styles.glassBadge}>
              <Text style={styles.glassBadgeText}>{todayWorkout?.dayLabel || 'PLAN'}</Text>
            </View>
          </View>
          
          <Text style={styles.cardTitle}>{todayWorkout?.title || 'Initialize Training'}</Text>
          <Text style={styles.cardSubtitle}>
            {todayWorkout ? getWorkoutLabel(todayWorkout) : 'Finish onboarding to generate your custom weekly plan.'}
          </Text>

          <Pressable
            style={styles.coachButton}
            onPress={() => navigation.navigate('FormCoach' as never)}
          >
            <Text style={styles.coachButtonText}>LAUNCH FORM COACH</Text>
          </Pressable>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionItem}
            onPress={() => navigation.navigate('Plan' as never)}
          >
            <Text style={styles.actionLabel}>WEEKLY PLAN</Text>
            <Text style={styles.actionSub}>View Cycle</Text>
          </Pressable>
          <View style={styles.actionSpacer} />
          <Pressable
            style={styles.actionItem}
            onPress={() => navigation.navigate('Library' as never)}
          >
            <Text style={styles.actionLabel}>LIBRARY</Text>
            <Text style={styles.actionSub}>Movement Prep</Text>
          </Pressable>
        </View>

        <View style={styles.techSection}>
          <Text style={styles.sectionHeading}>SYNC AUDIO</Text>
          <View style={styles.syncRow}>
            {PLAYLISTS.map((item) => (
              <Pressable key={item.label} onPress={() => openLink(item.url)} style={styles.syncChip}>
                <Text style={styles.syncChipText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.techSection}>
          <Text style={styles.sectionHeading}>TECHNICAL DATA</Text>
          <View style={styles.syncRow}>
            {CONTENT.map((item) => (
              <Pressable key={item.label} onPress={() => openLink(item.url)} style={styles.syncChip}>
                <Text style={styles.syncChipText}>{item.label}</Text>
              </Pressable>
            ))}
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 230, 193, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(44, 230, 193, 0.2)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginRight: 6,
  },
  statusText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  welcomeText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontFamily: FONT.body,
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  mainCard: {
    backgroundColor: 'rgba(26, 30, 35, 0.8)',
    borderRadius: RADIUS.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 24,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 2,
    fontFamily: FONT.heading,
  },
  glassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  glassBadgeText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    lineHeight: 20,
    marginBottom: 24,
  },
  coachButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  coachButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '900',
    fontFamily: FONT.heading,
    letterSpacing: 1.5,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  actionItem: {
    flex: 1,
    backgroundColor: 'rgba(26, 30, 35, 0.6)',
    padding: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionSpacer: {
    width: 16,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: 1,
  },
  actionSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  techSection: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textDim,
    letterSpacing: 2,
    marginBottom: 12,
    fontFamily: FONT.heading,
  },
  syncRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  syncChip: {
    backgroundColor: 'rgba(26, 30, 35, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    marginRight: 10,
    marginBottom: 10,
  },
  syncChipText: {
    color: COLORS.accentStrong,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FONT.heading,
    letterSpacing: 1,
  },
});
