import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Equipment, Experience, Goal, Injury, UserProfile } from '../types';
import { generateWeeklyPlan } from '../data/planGenerator';
import { STORAGE_KEYS } from '../data/storage';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

const { width } = Dimensions.get('window');

const GOALS: { label: string; value: Goal }[] = [
  { label: 'Strength', value: 'strength' },
  { label: 'Fat Loss', value: 'fat-loss' },
  { label: 'Mobility', value: 'mobility' },
];

const EQUIPMENT: { label: string; value: Equipment }[] = [
  { label: 'Bodyweight', value: 'home' },
  { label: 'Full Gym', value: 'gym' },
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
    if (!goal || !equipment || !experience) return;
    const profile: UserProfile = { goal, equipment, experience, injuries };
    const plan = generateWeeklyPlan(profile);
    await AsyncStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    await AsyncStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(plan));
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' as never }] });
  };

  const SelectionGroup = ({ title, options, current, onSelect, isMulti = false }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsRow}>
        {options.map((opt: any) => {
          const isActive = isMulti ? current.includes(opt.value) : current === opt.value;
          return (
            <Pressable
              key={opt.value}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => onSelect(opt.value)}
            >
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Fitness & Yoga</Text>
          <Text style={styles.subtitle}>Stay healthy and strong</Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>🧘‍♀️</Text>
          </View>
        </View>

        <SelectionGroup title="Your Goal" options={GOALS} current={goal} onSelect={setGoal} />
        <SelectionGroup title="Equipment Access" options={EQUIPMENT} current={equipment} onSelect={setEquipment} />
        <SelectionGroup title="Experience Level" options={EXPERIENCE} current={experience} onSelect={setExperience} />
        <SelectionGroup title="Any Injuries?" options={INJURIES} current={injuries} onSelect={toggleInjury} isMulti />

        <Pressable
          style={[styles.signUpButton, !canContinue && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </Pressable>

        <Text style={styles.footerText}>I have an account</Text>
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
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    width: 160,
    height: 160,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 70,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
    fontFamily: FONT.body,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    fontFamily: FONT.body,
  },
  optionTextActive: {
    color: COLORS.white,
  },
  signUpButton: {
    marginTop: 16,
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
    color: COLORS.textMuted,
    fontSize: 14,
    fontFamily: FONT.body,
  },
});
