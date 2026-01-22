import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

interface PoseMessage {
  exercise: string;
  repCount: number;
  cues: string[];
}

export default function FormCoach() {
  const [repCount, setRepCount] = useState(0);
  const [cues, setCues] = useState<string[]>([]);
  const [exercise, setExercise] = useState('plank');
  const [isPaused, setIsPaused] = useState(false);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FitForm</Text>
        <Text style={styles.headerSubtitle}>Morning Workout</Text>
      </View>

      <View style={styles.exerciseDisplay}>
        <Text style={styles.exerciseName}>{exercise}</Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerRing}>
          <Text style={styles.timerValue}>{repCount}</Text>
          <Text style={styles.timerUnit}>"</Text>
        </View>
      </View>

      <WebView
        source={require('../assets/pose.html')}
        style={styles.webview}
        javaScriptEnabled
        originWhitelist={['*']}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        onMessage={handleMessage}
      />

      <View style={styles.cueSection}>
        {cues.length > 0 && (
          <View style={styles.cueContainer}>
            {cues.map((cue, idx) => (
              <Text key={idx} style={styles.cueText}>• {cue}</Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.controlsRow}>
        <Pressable 
          style={[styles.controlButton, styles.pauseButton]}
          onPress={() => setIsPaused(!isPaused)}
        >
          <Text style={styles.controlButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
        </Pressable>
        <Pressable style={[styles.controlButton, styles.nextButton]}>
          <Text style={styles.controlButtonTextDark}>next</Text>
        </Pressable>
      </View>

      <View style={styles.nextExercise}>
        <Text style={styles.nextLabel}>next :</Text>
        <Text style={styles.nextName}>abdominal crunches</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
  },
  exerciseDisplay: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  exerciseName: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    textTransform: 'lowercase',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  timerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  timerValue: {
    fontSize: 72,
    fontWeight: '300',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  timerUnit: {
    fontSize: 36,
    fontWeight: '300',
    color: COLORS.text,
    marginTop: -20,
  },
  webview: {
    width: 1,
    height: 1,
    opacity: 0,
  },
  cueSection: {
    paddingHorizontal: 24,
    minHeight: 60,
  },
  cueContainer: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: 16,
  },
  cueText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 22,
  },
  controlsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: COLORS.accent,
  },
  nextButton: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  controlButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
  controlButtonTextDark: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
  nextExercise: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  nextLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginBottom: 4,
  },
  nextName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
});
