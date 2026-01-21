import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Pressable, Image, Dimensions } from 'react-native';
import ExerciseCard from '../components/ExerciseCard';
import { EXERCISES } from '../data/exercises';
import { Exercise } from '../types';
import { COLORS, FONT, RADIUS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

const { height } = Dimensions.get('window');

export default function Library() {
  const [selected, setSelected] = useState<Exercise | null>(null);

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>MOVEMENT ARCHIVE</Text>
          <Text style={styles.subtitle}>Verified protocols for optimal performance.</Text>
        </View>

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
          <Modal animationType="fade" transparent visible>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <View style={styles.modalImageContainer}>
                  <Image source={{ uri: selected.image }} style={styles.modalImage} />
                  <Pressable style={styles.closeCircle} onPress={() => setSelected(null)}>
                    <Text style={styles.closeText}>×</Text>
                  </Pressable>
                </View>
                
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selected.name.toUpperCase()}</Text>
                  <View style={styles.modalTagRow}>
                    {selected.tags.map(tag => (
                      <View key={tag} style={styles.modalTag}>
                        <Text style={styles.modalTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.modalDescription}>{selected.description}</Text>
                  
                  <Pressable style={styles.actionButton} onPress={() => setSelected(null)}>
                    <Text style={styles.actionButtonText}>DISMISS</Text>
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
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: 1.5,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  list: {
    paddingBottom: 100,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalImageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeCircle: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: 1,
  },
  modalTagRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
  },
  modalTag: {
    backgroundColor: 'rgba(44, 230, 193, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(44, 230, 193, 0.2)',
  },
  modalTagText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalDescription: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    fontFamily: FONT.heading,
    letterSpacing: 2,
  },
});
