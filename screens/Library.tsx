import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Image, Dimensions, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExerciseCard from '../components/ExerciseCard';
import AnimatedPressable from '../components/AnimatedPressable';
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
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(modalAnim, {
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  }, [selected]);

  const filteredExercises = useMemo(() => {
    if (activeFilter === 'all') return EXERCISES;
    return EXERCISES.filter(e => e.tags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <ScreenBackground>
      <Animated.View style={[styles.container, { paddingTop: Math.max(insets.top, 20) + 40, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Exercise Library</Text>
          <Text style={styles.subtitle}>Learn proper form for each exercise</Text>
        </View>

        <View style={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <AnimatedPressable
              key={cat.value}
              style={[styles.filterChip, activeFilter === cat.value && styles.filterChipActive]}
              onPress={() => setActiveFilter(cat.value)}
            >
              <Text style={[styles.filterText, activeFilter === cat.value && styles.filterTextActive]}>
                {cat.label}
              </Text>
            </AnimatedPressable>
          ))}
        </View>

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <AnimatedListItem index={index}>
              <ExerciseCard exercise={item} onPress={() => setSelected(item)} />
            </AnimatedListItem>
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
            <View style={styles.glassBackdrop}>
              <View style={styles.glassCard}>
                <View style={styles.modalImageContainer}>
                  <Image source={{ uri: selected.image }} style={styles.modalImage} />
                  <AnimatedPressable style={styles.closeButton} onPress={() => setSelected(null)}>
                    <Text style={styles.closeText}>×</Text>
                  </AnimatedPressable>
                </View>
                
                <View style={styles.glassContent}>
                  <Text style={styles.glassTitle}>{selected.name}</Text>
                  <View style={styles.glassTagRow}>
                    {selected.tags.map(tag => (
                      <View key={tag} style={styles.glassTag}>
                        <Text style={styles.glassTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.glassDescription}>{selected.description}</Text>
                  
                  <AnimatedPressable style={styles.glassButton} onPress={() => setSelected(null)}>
                    <Text style={styles.glassButtonText}>Close</Text>
                  </AnimatedPressable>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </Animated.View>
    </ScreenBackground>
  );
}

function AnimatedListItem({ children, index }: { children: React.ReactNode; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = Math.min(index * 50, 300);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {children}
    </Animated.View>
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
  glassBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  glassCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...SHADOWS.lg,
  },
  glassContent: {
    padding: 24,
  },
  glassTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: FONT.heading,
  },
  glassTagRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  glassTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  glassTagText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  glassDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: FONT.body,
    lineHeight: 24,
    marginBottom: 24,
  },
  glassButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  glassButtonText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONT.body,
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
