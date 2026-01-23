import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import AnimatedPressable from '../components/AnimatedPressable';

const QUOTE_SOURCES = [
  {
    author: 'Marcus Aurelius',
    work: 'Meditations',
    license: 'Public Domain',
    description: 'Roman Emperor and Stoic philosopher',
  },
  {
    author: 'Seneca',
    work: 'Letters from a Stoic, On the Shortness of Life',
    license: 'Public Domain',
    description: 'Roman Stoic philosopher and statesman',
  },
  {
    author: 'Epictetus',
    work: 'Discourses',
    license: 'Public Domain',
    description: 'Greek Stoic philosopher',
  },
  {
    author: 'Lao Tzu',
    work: 'Tao Te Ching',
    license: 'Public Domain',
    description: 'Ancient Chinese philosopher',
  },
  {
    author: 'Confucius',
    work: 'Analects',
    license: 'Public Domain',
    description: 'Chinese philosopher and teacher',
  },
  {
    author: 'Buddha (Siddhartha Gautama)',
    work: 'Dhammapada',
    license: 'Public Domain',
    description: 'Spiritual teacher and founder of Buddhism',
  },
  {
    author: 'Plato & Aristotle',
    work: 'Various works',
    license: 'Public Domain',
    description: 'Ancient Greek philosophers',
  },
  {
    author: 'Ralph Waldo Emerson',
    work: 'Essays',
    license: 'Public Domain',
    description: 'American essayist and philosopher',
  },
  {
    author: 'Henry David Thoreau',
    work: 'Walden',
    license: 'Public Domain',
    description: 'American naturalist and philosopher',
  },
  {
    author: 'Miyamoto Musashi',
    work: 'The Book of Five Rings',
    license: 'Public Domain',
    description: 'Japanese swordsman and philosopher',
  },
  {
    author: 'Sun Tzu',
    work: 'The Art of War',
    license: 'Public Domain',
    description: 'Chinese military strategist',
  },
  {
    author: 'Traditional Proverbs',
    work: 'Japanese & Chinese Proverbs',
    license: 'Public Domain',
    description: 'Ancient wisdom from Eastern traditions',
  },
];

export default function Credits() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground>
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 20) + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AnimatedPressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Credits & Licenses</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Open Source Wisdom</Text>
          <Text style={styles.introText}>
            Pinnacle's mindset content draws from humanity's greatest thinkers. All quotes 
            are from public domain sources, freely available to inspire everyone on their 
            journey to reach their peak.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Quote Sources</Text>
        
        {QUOTE_SOURCES.map((source, index) => (
          <View key={index} style={styles.sourceCard}>
            <View style={styles.sourceHeader}>
              <Text style={styles.sourceAuthor}>{source.author}</Text>
              <View style={styles.licenseBadge}>
                <Text style={styles.licenseText}>{source.license}</Text>
              </View>
            </View>
            <Text style={styles.sourceWork}>{source.work}</Text>
            <Text style={styles.sourceDescription}>{source.description}</Text>
          </View>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Public Domain</Text>
          <Text style={styles.infoText}>
            Works in the public domain are free from copyright restrictions and can be 
            freely used, shared, and adapted. These timeless teachings belong to all of 
            humanity.
          </Text>
        </View>

        <View style={styles.pinnacleCard}>
          <Text style={styles.pinnacleTitle}>Pinnacle Original</Text>
          <Text style={styles.pinnacleText}>
            Some mantras and reflections in this app are original content created for 
            Pinnacle, designed to complement the ancient wisdom with modern motivation.
          </Text>
        </View>

        <Pressable 
          style={styles.linkButton}
          onPress={() => Linking.openURL('https://creativecommons.org/publicdomain/zero/1.0/')}
        >
          <Text style={styles.linkButtonText}>Learn More About CC0</Text>
        </Pressable>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  placeholder: {
    width: 40,
  },
  introCard: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: 24,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: FONT.heading,
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: FONT.body,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  sourceCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sourceAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    flex: 1,
  },
  licenseBadge: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  licenseText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
    fontFamily: FONT.body,
  },
  sourceWork: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  sourceDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
  },
  infoCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginTop: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 20,
  },
  pinnacleCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  pinnacleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
    fontFamily: FONT.heading,
    marginBottom: 8,
  },
  pinnacleText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 20,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
    fontFamily: FONT.body,
    textDecorationLine: 'underline',
  },
});
