import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Equipment, Experience, Goal, Injury, UserProfile } from '../types';
import { generateWeeklyPlan } from '../data/planGenerator';
import { STORAGE_KEYS } from '../data/storage';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import AnimatedPressable from '../components/AnimatedPressable';

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
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [injuries, setInjuries] = useState<Injury[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 10,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  const toggleInjury = (injury: Injury) => {
    setInjuries((prev) =>
      prev.includes(injury) ? prev.filter((item) => item !== injury) : [...prev, injury]
    );
  };

  const canContinue = name.trim() && goal && equipment && experience;

  const handleContinue = async () => {
    if (!name.trim() || !goal || !equipment || !experience) return;
    const profile: UserProfile = { name: name.trim(), goal, equipment, experience, injuries };
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
            <AnimatedPressable
              key={opt.value}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => onSelect(opt.value)}
            >
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {opt.label}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScreenBackground>
      <Animated.ScrollView 
        contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 20) + 40 }]} 
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pinnacle</Text>
          <Text style={styles.subtitle}>Reach your peak — body, mind & spirit</Text>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>🏋️</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <SelectionGroup title="Your Goal" options={GOALS} current={goal} onSelect={setGoal} />
        <SelectionGroup title="Equipment Access" options={EQUIPMENT} current={equipment} onSelect={setEquipment} />
        <SelectionGroup title="Experience Level" options={EXPERIENCE} current={experience} onSelect={setExperience} />
        <SelectionGroup title="Any Injuries?" options={INJURIES} current={injuries} onSelect={toggleInjury} isMulti />

        <AnimatedPressable
          style={[styles.signUpButton, !canContinue && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.signUpButtonText}>Get Started</Text>
        </AnimatedPressable>
      </Animated.ScrollView>
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
    width: 120,
    height: 120,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 56,
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
  nameInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
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
});
