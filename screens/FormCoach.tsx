import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

interface PoseMessage {
  exercise: string;
  repCount: number;
  cues: string[];
}

export default function FormCoach() {
  const navigation = useNavigation();
  const [repCount, setRepCount] = useState(0);
  const [cues, setCues] = useState<string[]>([]);
  const [exercise, setExercise] = useState('squat');
  const [isActive, setIsActive] = useState(false);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as PoseMessage;
      if (data.exercise) setExercise(data.exercise);
      if (typeof data.repCount === 'number') setRepCount(data.repCount);
      if (Array.isArray(data.cues)) setCues(data.cues.slice(0, 3));
    } catch (error) {
      // Ignore malformed pose messages.
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Form Coach</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseLabel}>Current Exercise</Text>
          <Text style={styles.exerciseName}>{exercise}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{repCount}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statusDot, isActive && styles.statusDotActive]} />
            <Text style={styles.statLabel}>{isActive ? 'Active' : 'Ready'}</Text>
          </View>
        </View>

        <View style={styles.cameraSection}>
          <View style={styles.cameraPlaceholder}>
            <WebView
              source={require('../assets/pose.html')}
              style={styles.webview}
              javaScriptEnabled
              originWhitelist={['*']}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback
              onMessage={handleMessage}
              onLoadEnd={() => setIsActive(true)}
            />
          </View>
          <Text style={styles.cameraHint}>Position yourself in frame</Text>
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Form Feedback</Text>
          {cues.length === 0 ? (
            <Text style={styles.feedbackEmpty}>Detecting movement...</Text>
          ) : (
            cues.map((cue, idx) => (
              <View key={idx} style={styles.feedbackItem}>
                <Text style={styles.feedbackBullet}>•</Text>
                <Text style={styles.feedbackText}>{cue}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <Text style={styles.tipItem}>• Stand 6-8 feet from camera</Text>
          <Text style={styles.tipItem}>• Ensure good lighting</Text>
          <Text style={styles.tipItem}>• Wear fitted clothing</Text>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  headerSpacer: {
    width: 24,
  },
  exerciseCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  exerciseLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.textMuted,
    marginBottom: 8,
  },
  statusDotActive: {
    backgroundColor: COLORS.success,
  },
  cameraSection: {
    marginBottom: 20,
  },
  cameraPlaceholder: {
    height: 200,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 8,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
  },
  cameraHint: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
  },
  feedbackCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  feedbackEmpty: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    fontStyle: 'italic',
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  feedbackBullet: {
    fontSize: 14,
    color: COLORS.accent,
    marginRight: 8,
    fontWeight: '700',
  },
  feedbackText: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: FONT.body,
    flex: 1,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipItem: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 22,
  },
});
