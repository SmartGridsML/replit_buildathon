import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Workout } from '../types';
import { COLORS, FONT, RADIUS } from '../theme';

interface PlanCardProps {
  workout: Workout;
  exerciseLabels?: string;
}

export default function PlanCard({ workout, exerciseLabels }: PlanCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.dayBadge}>
          <Text style={styles.day}>{workout.dayLabel}</Text>
        </View>
        <Text style={styles.title}>{workout.title}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.focus}>{workout.focus}</Text>
        <Text style={styles.exercises} numberOfLines={2}>
          {exerciseLabels || workout.exerciseIds.join(' | ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(26, 30, 35, 0.8)',
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayBadge: {
    backgroundColor: COLORS.chip,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(44, 230, 193, 0.2)',
  },
  day: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: COLORS.accent,
    letterSpacing: 1.5,
    fontWeight: '700',
    fontFamily: FONT.heading,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: 0.5,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.03)',
    paddingTop: 10,
  },
  focus: {
    color: COLORS.accentStrong,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: FONT.body,
    marginBottom: 4,
  },
  exercises: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontFamily: FONT.body,
    lineHeight: 18,
  },
});
