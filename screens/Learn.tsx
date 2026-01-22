import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { LEARN_TOPICS, LEARN_CATEGORIES } from '../data/learnContent';
import { LearnTopic } from '../types';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

export default function Learn() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState<LearnTopic | null>(null);

  const filteredTopics = selectedCategory === 'all'
    ? LEARN_TOPICS
    : LEARN_TOPICS.filter(topic => topic.category === selectedCategory);

  return (
    <ScreenBackground>
      <ScrollView style={styles.root} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>Understand your body</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {LEARN_CATEGORIES.map(category => (
            <Pressable
              key={category.id}
              style={[
                styles.filterChip,
                selectedCategory === category.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.filterIcon}>{category.icon}</Text>
              <Text style={[
                styles.filterText,
                selectedCategory === category.id && styles.filterTextActive
              ]}>
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.topicsGrid}>
          {filteredTopics.map(topic => (
            <Pressable
              key={topic.id}
              style={styles.topicCard}
              onPress={() => setSelectedTopic(topic)}
            >
              <Text style={styles.topicIcon}>{topic.icon}</Text>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicSummary} numberOfLines={2}>{topic.summary}</Text>
              <View style={styles.readMore}>
                <Text style={styles.readMoreText}>Read more</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedTopic}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedTopic(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setSelectedTopic(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>← Back</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedTopic && (
              <>
                <Text style={styles.modalIcon}>{selectedTopic.icon}</Text>
                <Text style={styles.modalTitle}>{selectedTopic.title}</Text>
                <Text style={styles.modalCategory}>
                  {LEARN_CATEGORIES.find(c => c.id === selectedTopic.category)?.label}
                </Text>
                <Text style={styles.modalBody}>{selectedTopic.content}</Text>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  filterScroll: {
    marginHorizontal: -24,
    marginBottom: 20,
  },
  filterContainer: {
    paddingHorizontal: 24,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.body,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  topicsGrid: {
    gap: 12,
  },
  topicCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  topicIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 6,
  },
  topicSummary: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMore: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accent,
    fontFamily: FONT.body,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.white,
  },
  closeButton: {
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
    fontFamily: FONT.body,
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 8,
  },
  modalCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  modalBody: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: FONT.body,
    lineHeight: 26,
  },
});
