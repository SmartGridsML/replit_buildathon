import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Exercise } from '../types';
import { COLORS, FONT, RADIUS } from '../theme';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
}

export default function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: exercise.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {exercise.description}
        </Text>
        <View style={styles.tagRow}>
          {exercise.tags.slice(0, 2).map((tag) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  image: {
    width: 110,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
    fontFamily: FONT.body,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    backgroundColor: 'rgba(44, 230, 193, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 11,
    color: COLORS.accentStrong,
    marginRight: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: FONT.body,
  },
});
