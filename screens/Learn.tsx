import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LEARN_TOPICS, LEARN_CATEGORIES } from '../data/learnContent';
import { LearnTopic } from '../types';
import { recordTopicRead } from '../data/gamification';
import { STORAGE_KEYS } from '../data/storage';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import AnimatedPressable from '../components/AnimatedPressable';

export default function Learn() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState<LearnTopic | null>(null);
  const [readTopics, setReadTopics] = useState<string[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
    const loadReadTopics = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.readTopics);
      if (stored) {
        setReadTopics(JSON.parse(stored));
      }
    };
    loadReadTopics();
  }, []);

  const handleOpenTopic = async (topic: LearnTopic) => {
    setSelectedTopic(topic);
    if (!readTopics.includes(topic.id)) {
      await recordTopicRead(topic.id);
      setReadTopics(prev => [...prev, topic.id]);
    }
  };

  const filteredTopics = selectedCategory === 'all'
    ? LEARN_TOPICS
    : LEARN_TOPICS.filter(topic => topic.category === selectedCategory);

  const isTopicRead = (topicId: string) => readTopics.includes(topicId);

  return (
    <ScreenBackground>
      <Animated.ScrollView 
        style={[styles.root, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]} 
        contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 20) + 40 }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.subtitle}>Understand your body</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>{readTopics.length}/{LEARN_TOPICS.length} completed</Text>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {LEARN_CATEGORIES.map(category => (
            <AnimatedPressable
              key={category.id}
              style={[
                styles.filterChip,
                selectedCategory === category.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
              accessibilityLabel={`Filter by ${category.label}`}
              accessibilityRole="button"
            >
              <Text style={styles.filterIcon}>{category.icon}</Text>
              <Text style={[
                styles.filterText,
                selectedCategory === category.id && styles.filterTextActive
              ]}>
                {category.label}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>

        <View style={styles.topicsGrid}>
          {filteredTopics.map(topic => (
            <AnimatedPressable
              key={topic.id}
              style={[styles.topicCard, isTopicRead(topic.id) && styles.topicCardRead]}
              onPress={() => handleOpenTopic(topic)}
              accessibilityLabel={`${topic.title}. ${isTopicRead(topic.id) ? 'Already read' : 'Tap to read'}`}
              accessibilityRole="button"
            >
              <View style={styles.topicHeader}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
                {isTopicRead(topic.id) && (
                  <View style={styles.readBadge}>
                    <Text style={styles.readBadgeText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicSummary} numberOfLines={2}>{topic.summary}</Text>
              <View style={styles.readMore}>
                <Text style={styles.readMoreText}>
                  {isTopicRead(topic.id) ? 'Read again' : 'Read more →'}
                </Text>
              </View>
            </AnimatedPressable>
          ))}
        </View>
      </Animated.ScrollView>

      <Modal
        visible={!!selectedTopic}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedTopic(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <AnimatedPressable onPress={() => setSelectedTopic(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>← Back</Text>
            </AnimatedPressable>
            {selectedTopic && isTopicRead(selectedTopic.id) && (
              <View style={styles.xpEarnedBadge}>
                <Text style={styles.xpEarnedText}>+10 XP earned</Text>
              </View>
            )}
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
  progressBadge: {
    backgroundColor: COLORS.successLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
    fontFamily: FONT.body,
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
  topicCardRead: {
    borderColor: COLORS.success,
    borderWidth: 2,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  topicIcon: {
    fontSize: 32,
  },
  readBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  xpEarnedBadge: {
    backgroundColor: COLORS.successLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
  },
  xpEarnedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
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
