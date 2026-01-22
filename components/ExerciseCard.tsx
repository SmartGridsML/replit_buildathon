import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { Exercise } from '../types';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
}

export default function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.checkCircle}>
        <Text style={styles.bullet}>○</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {exercise.description}
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: exercise.image }} style={styles.image} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bullet: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontFamily: FONT.body,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceElevated,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
