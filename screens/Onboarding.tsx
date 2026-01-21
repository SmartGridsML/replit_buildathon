import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Equipment, Experience, Goal, Injury, UserProfile } from '../types';
import { generateWeeklyPlan } from '../data/planGenerator';
import { STORAGE_KEYS } from '../data/storage';
import { COLORS, FONT, RADIUS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

const GOALS: { label: string; value: Goal }[] = [
  { label: 'Strength', value: 'strength' },
  { label: 'Fat Loss', value: 'fat-loss' },
  { label: 'Mobility', value: 'mobility' },
];

const EQUIPMENT: { label: string; value: Equipment }[] = [
  { label: 'Home / Bodyweight', value: 'home' },
  { label: 'Gym Access', value: 'gym' },
];

const EXPERIENCE: { label: string; value: Experience }[] = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
];

const INJURIES: { label: string; value: Injury }[] = [
  { label: 'Knee', value: 'knee' },
  { label: 'Shoulder', value: 'shoulder' },
  { label: 'Back', value: 'back' },
];

export default function Onboarding() {
  const navigation = useNavigation();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [injuries, setInjuries] = useState<Injury[]>([]);

  const toggleInjury = (injury: Injury) => {
    setInjuries((prev) =>
      prev.includes(injury) ? prev.filter((item) => item !== injury) : [...prev, injury]
    );
  };

  const canContinue = goal && equipment && experience;

  const handleContinue = async () => {
    if (!goal || !equipment || !experience) {
      return;
    }

    const profile: UserProfile = {
      goal,
      equipment,
      experience,
      injuries,
    };

    const plan = generateWeeklyPlan(profile);

    await AsyncStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    await AsyncStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(plan));

    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' as never }],
    });
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Build your FitForm plan</Text>
        <Text style={styles.subtitle}>Answer a few quick questions to personalize your week.</Text>

      <Text style={styles.sectionTitle}>Goal</Text>
      <View style={styles.row}>
        {GOALS.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.pill, goal === option.value && styles.pillActive]}
            onPress={() => setGoal(option.value)}
          >
            <Text style={[styles.pillText, goal === option.value && styles.pillTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Equipment</Text>
      <View style={styles.row}>
        {EQUIPMENT.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.pill, equipment === option.value && styles.pillActive]}
            onPress={() => setEquipment(option.value)}
          >
            <Text style={[styles.pillText, equipment === option.value && styles.pillTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Experience</Text>
      <View style={styles.row}>
        {EXPERIENCE.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.pill, experience === option.value && styles.pillActive]}
            onPress={() => setExperience(option.value)}
          >
            <Text style={[styles.pillText, experience === option.value && styles.pillTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Injuries (optional)</Text>
      <View style={styles.row}>
        {INJURIES.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.pill, injuries.includes(option.value) && styles.pillActive]}
            onPress={() => toggleInjury(option.value)}
          >
            <Text
              style={[
                styles.pillText,
                injuries.includes(option.value) && styles.pillTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

        <Pressable
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.ctaText}>Create My Plan</Text>
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
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    fontFamily: FONT.heading,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginBottom: 20,
    fontFamily: FONT.body,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: COLORS.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  pillActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  pillText: {
    fontSize: 12,
    color: COLORS.text,
    fontFamily: FONT.body,
  },
  pillTextActive: {
    color: COLORS.background,
  },
  cta: {
    marginTop: 24,
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.4,
  },
  ctaText: {
    color: COLORS.background,
    fontWeight: '600',
    fontFamily: FONT.heading,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
