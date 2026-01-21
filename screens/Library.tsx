import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Pressable, Image } from 'react-native';
import ExerciseCard from '../components/ExerciseCard';
import { EXERCISES } from '../data/exercises';
import { Exercise } from '../types';
import { COLORS, FONT, RADIUS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

export default function Library() {
  const [selected, setSelected] = useState<Exercise | null>(null);

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Exercise Library</Text>
        <Text style={styles.subtitle}>Curated movements for your plan.</Text>

        <FlatList
          data={EXERCISES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard exercise={item} onPress={() => setSelected(item)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />

        {selected && (
          <Modal animationType="slide" transparent visible>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Image source={{ uri: selected.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selected.name}</Text>
                <Text style={styles.modalDescription}>{selected.description}</Text>
                <Pressable style={styles.modalButton} onPress={() => setSelected(null)}>
                  <Text style={styles.modalButtonText}>Close</Text>
                </Pressable>
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
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  subtitle: {
    color: COLORS.textMuted,
    marginBottom: 16,
    fontFamily: FONT.body,
  },
  list: {
    paddingBottom: 40,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.md,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  modalDescription: {
    marginTop: 8,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
  },
  modalButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.background,
    fontWeight: '600',
    fontFamily: FONT.heading,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
