import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Workout } from '../types';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';

interface PlanCardProps {
  workout: Workout;
  exerciseLabels?: string;
  onStart?: () => void;
}

export default function PlanCard({ workout, exerciseLabels, onStart }: PlanCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>○</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{workout.title}</Text>
          <Text style={styles.focus}>{workout.focus}</Text>
        </View>
        <View style={styles.dayBadge}>
          <Text style={styles.day}>{workout.dayLabel}</Text>
        </View>
      </View>
      <Text style={styles.exercises} numberOfLines={2}>
        {exerciseLabels || workout.exerciseIds.join(' • ')}
      </Text>
      {onStart && (
        <Pressable style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Start</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkMark: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  headerContent: {
    flex: 1,
  },
  dayBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  day: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  focus: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: FONT.body,
    marginTop: 2,
  },
  exercises: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontFamily: FONT.body,
    lineHeight: 18,
    marginLeft: 36,
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginTop: 4,
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
});
