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
      <View style={styles.imageContainer}>
        <Image source={{ uri: exercise.image }} style={styles.image} />
        <View style={styles.imageOverlay} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {exercise.description}
        </Text>
        <View style={styles.tagRow}>
          {exercise.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tagBadge}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 30, 35, 0.6)',
    borderRadius: RADIUS.lg,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(10px)' }),
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 13, 15, 0.2)',
  },
  content: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    fontFamily: FONT.body,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tagBadge: {
    backgroundColor: COLORS.chip,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(44, 230, 193, 0.1)',
  },
  tagText: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: FONT.heading,
  },
});
