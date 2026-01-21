import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, FONT, RADIUS } from '../theme';

interface PoseMessage {
  exercise: string;
  repCount: number;
  cues: string[];
}

export default function FormCoach() {
  const [repCount, setRepCount] = useState(0);
  const [cues, setCues] = useState<string[]>([]);
  const [exercise, setExercise] = useState('squat');

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as PoseMessage;
      if (data.exercise) {
        setExercise(data.exercise);
      }
      if (typeof data.repCount === 'number') {
        setRepCount(data.repCount);
      }
      if (Array.isArray(data.cues)) {
        setCues(data.cues.slice(0, 3));
      }
    } catch (error) {
      // Ignore malformed pose messages.
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={require('../assets/pose.html')}
        style={styles.webview}
        javaScriptEnabled
        originWhitelist={['*']}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        onMessage={handleMessage}
      />
      <View style={styles.overlay} pointerEvents="none">
        <Text style={styles.exerciseLabel}>{exercise.toUpperCase()}</Text>
        <Text style={styles.repCount}>{repCount}</Text>
        <Text style={styles.cuesTitle}>Cues</Text>
        {cues.length === 0 ? (
          <Text style={styles.cueText}>Start moving to get feedback.</Text>
        ) : (
          cues.map((cue) => (
            <Text key={cue} style={styles.cueText}>
              {cue}
            </Text>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webview: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(12, 16, 20, 0.78)',
    padding: 16,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  exerciseLabel: {
    color: COLORS.accentStrong,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
    fontFamily: FONT.body,
  },
  repCount: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: '700',
    marginVertical: 4,
    fontFamily: FONT.heading,
  },
  cuesTitle: {
    color: COLORS.textDim,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 6,
    fontFamily: FONT.body,
  },
  cueText: {
    color: COLORS.text,
    marginTop: 4,
    fontFamily: FONT.body,
  },
});
