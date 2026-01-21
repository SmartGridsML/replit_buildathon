import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Equipment, Experience, Goal, Injury, UserProfile } from '../types';
import { generateWeeklyPlan } from '../data/planGenerator';
import { STORAGE_KEYS } from '../data/storage';
import { COLORS, FONT, RADIUS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

const { width } = Dimensions.get('window');

const GOALS: { label: string; value: Goal }[] = [
  { label: 'STRENGTH', value: 'strength' },
  { label: 'FAT LOSS', value: 'fat-loss' },
  { label: 'MOBILITY', value: 'mobility' },
];

const EQUIPMENT: { label: string; value: Equipment }[] = [
  { label: 'BODYWEIGHT', value: 'home' },
  { label: 'FULL GYM', value: 'gym' },
];

const EXPERIENCE: { label: string; value: Experience }[] = [
  { label: 'BEGINNER', value: 'beginner' },
  { label: 'INTERMEDIATE', value: 'intermediate' },
];

const INJURIES: { label: string; value: Injury }[] = [
  { label: 'KNEE', value: 'knee' },
  { label: 'SHOULDER', value: 'shoulder' },
  { label: 'BACK', value: 'back' },
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
      <View style={styles.grid}>
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
              {isActive && <View style={styles.activeIndicator} />}
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
          <Text style={styles.title}>INITIALIZE PROTOCOL</Text>
          <Text style={styles.subtitle}>Define your parameters for the custom training cycle.</Text>
        </View>

        <SelectionGroup title="PRIMARY OBJECTIVE" options={GOALS} current={goal} onSelect={setGoal} />
        <SelectionGroup title="HARDWARE ACCESS" options={EQUIPMENT} current={equipment} onSelect={setEquipment} />
        <SelectionGroup title="TECHNICAL EXPERIENCE" options={EXPERIENCE} current={experience} onSelect={setExperience} />
        <SelectionGroup title="LIMITING FACTORS" options={INJURIES} current={injuries} onSelect={toggleInjury} isMulti />

        <Pressable
          style={[styles.cta, !canContinue && styles.ctaDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.ctaText}>GENERATE PLAN</Text>
        </Pressable>
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
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: 2,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontFamily: FONT.body,
    marginTop: 8,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textDim,
    letterSpacing: 2,
    marginBottom: 12,
    fontFamily: FONT.heading,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  option: {
    width: (width - 48 - 24) / 2,
    margin: 6,
    backgroundColor: 'rgba(26, 30, 35, 0.6)',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  optionActive: {
    borderColor: 'rgba(44, 230, 193, 0.3)',
    backgroundColor: 'rgba(44, 230, 193, 0.05)',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
    fontFamily: FONT.heading,
    letterSpacing: 1,
  },
  optionTextActive: {
    color: COLORS.accent,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.accent,
  },
  cta: {
    marginTop: 16,
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ctaDisabled: {
    opacity: 0.15,
  },
  ctaText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '900',
    fontFamily: FONT.heading,
    letterSpacing: 2,
  },
});
