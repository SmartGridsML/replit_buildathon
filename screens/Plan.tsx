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

export default function Plan() {
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

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>TRAINING CYCLE</Text>
          <Text style={styles.subtitle}>Optimized for your goal and equipment.</Text>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>EXPERIENCE</Text>
            <Text style={styles.summaryValue}>{profile?.experience?.toUpperCase() || '---'}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>GOAL</Text>
            <Text style={styles.summaryValue}>{profile?.goal?.toUpperCase() || '---'}</Text>
          </View>
        </View>

        {plan?.workouts.length ? (
          <View style={styles.list}>
            {plan.workouts.map((workout) => (
              <PlanCard
                key={workout.id}
                workout={workout}
                exerciseLabels={getExerciseNames(workout)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Protocol not initialized.</Text>
          </View>
        )}

        <Pressable style={styles.regen} onPress={regeneratePlan}>
          <Text style={styles.regenText}>RECALIBRATE PLAN</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: 1.5,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 30, 35, 0.6)',
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.textDim,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '700',
    fontFamily: FONT.heading,
  },
  list: {
    marginBottom: 24,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textDim,
    fontFamily: FONT.body,
    fontSize: 14,
  },
  regen: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(44, 230, 193, 0.3)',
  },
  regenText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '900',
    fontFamily: FONT.heading,
    letterSpacing: 1.5,
  },
});
