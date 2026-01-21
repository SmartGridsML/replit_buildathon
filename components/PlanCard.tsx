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
        <Text style={styles.day}>{workout.dayLabel}</Text>
        <Text style={styles.title}>{workout.title}</Text>
      </View>
      <Text style={styles.focus}>{workout.focus}</Text>
      <Text style={styles.exercises}>
        {exerciseLabels || workout.exerciseIds.join(' | ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  day: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: COLORS.textDim,
    letterSpacing: 1,
    fontFamily: FONT.body,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  focus: {
    marginTop: 6,
    color: COLORS.accentStrong,
    fontSize: 13,
    fontFamily: FONT.body,
  },
  exercises: {
    marginTop: 10,
    color: COLORS.textDim,
    fontSize: 12,
    fontFamily: FONT.body,
  },
});
