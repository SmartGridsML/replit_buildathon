import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import AnimatedPressable from '../components/AnimatedPressable';

const exercises = [
  { id: 'squat', name: 'Squat', icon: '🏋️' },
  { id: 'pushup', name: 'Push-Up', icon: '💪' },
  { id: 'plank', name: 'Plank', icon: '🧘' },
  { id: 'lunge', name: 'Lunge', icon: '🦵' },
];

const formTips: Record<string, { cues: string[]; common: string[] }> = {
  squat: {
    cues: [
      'Keep your chest up and back straight',
      'Push your knees out over your toes',
      'Go as low as your mobility allows',
      'Drive through your heels to stand',
    ],
    common: [
      'Knees caving inward',
      'Heels lifting off the floor',
      'Leaning too far forward',
    ],
  },
  pushup: {
    cues: [
      'Keep your body in a straight line',
      'Lower your chest toward the floor',
      'Keep elbows at 45-degree angle',
      'Fully extend arms at the top',
    ],
    common: [
      'Sagging hips',
      'Flaring elbows out wide',
      'Not going low enough',
    ],
  },
  plank: {
    cues: [
      'Keep your body in a straight line',
      'Engage your core and glutes',
      'Look at the floor, not forward',
      'Breathe steadily throughout',
    ],
    common: [
      'Hips too high or too low',
      'Holding breath',
      'Looking up straining neck',
    ],
  },
  lunge: {
    cues: [
      'Step forward with control',
      'Lower until both knees are at 90°',
      'Keep front knee over ankle',
      'Push through front heel to return',
    ],
    common: [
      'Knee going past toes',
      'Torso leaning forward',
      'Losing balance',
    ],
  },
};

export default function FormCoach() {
  const insets = useSafeAreaInsets();
  const [selectedExercise, setSelectedExercise] = useState('squat');

  const currentTips = formTips[selectedExercise];
  const currentExercise = exercises.find((e) => e.id === selectedExercise);

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 20) + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Form Coach</Text>
          <Text style={styles.headerSubtitle}>Learn proper exercise form</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.exerciseScroll}
          contentContainerStyle={styles.exerciseSelector}
        >
          {exercises.map((ex) => (
            <AnimatedPressable
              key={ex.id}
              style={[
                styles.exerciseTab,
                selectedExercise === ex.id && styles.exerciseTabActive,
              ]}
              onPress={() => setSelectedExercise(ex.id)}
            >
              <Text style={styles.exerciseTabIcon}>{ex.icon}</Text>
              <Text
                style={[
                  styles.exerciseTabText,
                  selectedExercise === ex.id && styles.exerciseTabTextActive,
                ]}
              >
                {ex.name}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>

        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{currentExercise?.icon}</Text>
          <Text style={styles.heroTitle}>{currentExercise?.name}</Text>
          <Text style={styles.heroSubtitle}>Form Guide</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Form Cues</Text>
          {currentTips.cues.map((cue, idx) => (
            <View key={idx} style={styles.tipItem}>
              <View style={styles.tipNumber}>
                <Text style={styles.tipNumberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.tipText}>{cue}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Mistakes</Text>
          {currentTips.common.map((mistake, idx) => (
            <View key={idx} style={styles.mistakeItem}>
              <Text style={styles.mistakeIcon}>⚠️</Text>
              <Text style={styles.mistakeText}>{mistake}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>💡</Text>
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>Pro Tip</Text>
            <Text style={styles.noteText}>
              Practice in front of a mirror to check your form, or record yourself to review later.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
  },
  exerciseScroll: {
    marginHorizontal: -24,
    marginBottom: 20,
  },
  exerciseSelector: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
  },
  exerciseTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  exerciseTabActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  exerciseTabIcon: {
    fontSize: 18,
  },
  exerciseTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.body,
  },
  exerciseTabTextActive: {
    color: COLORS.white,
  },
  heroCard: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.md,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: FONT.heading,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT.body,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: FONT.body,
    lineHeight: 22,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    padding: 14,
    borderRadius: RADIUS.md,
    marginBottom: 8,
    gap: 12,
  },
  mistakeIcon: {
    fontSize: 16,
  },
  mistakeText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
    ...SHADOWS.sm,
  },
  noteIcon: {
    fontSize: 24,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 20,
  },
});
