import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Pressable, Image, Dimensions } from 'react-native';
import ExerciseCard from '../components/ExerciseCard';
import { EXERCISES } from '../data/exercises';
import { Exercise } from '../types';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

const { height } = Dimensions.get('window');

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Upper', value: 'upper' },
  { label: 'Lower', value: 'legs' },
  { label: 'Core', value: 'core' },
  { label: 'Mobility', value: 'mobility' },
];

export default function Library() {
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredExercises = useMemo(() => {
    if (activeFilter === 'all') return EXERCISES;
    return EXERCISES.filter(e => e.tags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Exercise Library</Text>
          <Text style={styles.subtitle}>Learn proper form for each exercise</Text>
        </View>

        <View style={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat.value}
              style={[styles.filterChip, activeFilter === cat.value && styles.filterChipActive]}
              onPress={() => setActiveFilter(cat.value)}
            >
              <Text style={[styles.filterText, activeFilter === cat.value && styles.filterTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard exercise={item} onPress={() => setSelected(item)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No exercises in this category</Text>
            </View>
          }
        />

        {selected && (
          <Modal animationType="fade" transparent visible>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <View style={styles.modalImageContainer}>
                  <Image source={{ uri: selected.image }} style={styles.modalImage} />
                  <Pressable style={styles.closeButton} onPress={() => setSelected(null)}>
                    <Text style={styles.closeText}>×</Text>
                  </Pressable>
                </View>
                
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selected.name}</Text>
                  <View style={styles.modalTagRow}>
                    {selected.tags.map(tag => (
                      <View key={tag} style={styles.modalTag}>
                        <Text style={styles.modalTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.modalDescription}>{selected.description}</Text>
                  
                  <Pressable style={styles.dismissButton} onPress={() => setSelected(null)}>
                    <Text style={styles.dismissButtonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  list: {
    paddingBottom: 100,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontFamily: FONT.body,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  modalImageContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  closeText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  modalTagRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  modalTag: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  modalTagText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 24,
    marginBottom: 24,
  },
  dismissButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
});
