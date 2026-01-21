import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, FONT, RADIUS } from '../theme';

const { width } = Dimensions.get('window');

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
      if (data.exercise) setExercise(data.exercise);
      if (typeof data.repCount === 'number') setRepCount(data.repCount);
      if (Array.isArray(data.cues)) setCues(data.cues.slice(0, 3));
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
      
      {/* HUD Overlay */}
      <View style={styles.hudOverlay} pointerEvents="none">
        <View style={styles.topHud}>
          <View style={styles.headerBox}>
            <Text style={styles.hudLabel}>SESSION PROTOCOL</Text>
            <Text style={styles.exerciseText}>{exercise.toUpperCase()}</Text>
          </View>
          <View style={styles.repBox}>
            <Text style={styles.repLabel}>REPS</Text>
            <Text style={styles.repValue}>{repCount}</Text>
          </View>
        </View>

        <View style={styles.bottomHud}>
          <View style={styles.cueBox}>
            <View style={styles.cueHeader}>
              <View style={styles.activeDot} />
              <Text style={styles.cueHeaderText}>FORM FEEDBACK</Text>
            </View>
            <View style={styles.cueList}>
              {cues.length === 0 ? (
                <Text style={styles.cueTextEmpty}>DETECTING MOVEMENT...</Text>
              ) : (
                cues.map((cue, idx) => (
                  <View key={idx} style={styles.cueItem}>
                    <Text style={styles.cueBullet}>&gt;</Text>
                    <Text style={styles.cueText}>{cue.toUpperCase()}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </View>
      
      {/* HUD Decorations */}
      <View style={styles.cornerTL} pointerEvents="none" />
      <View style={styles.cornerTR} pointerEvents="none" />
      <View style={styles.cornerBL} pointerEvents="none" />
      <View style={styles.cornerBR} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  hudOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  topHud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  hudLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  exerciseText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: FONT.heading,
  },
  repBox: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  repLabel: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
  repValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
    fontFamily: FONT.heading,
  },
  bottomHud: {
    width: '100%',
  },
  cueBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(44, 230, 193, 0.2)',
  },
  cueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentStrong,
    marginRight: 8,
  },
  cueHeaderText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  cueList: {
    gap: 6,
  },
  cueItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cueBullet: {
    color: COLORS.accent,
    fontSize: 12,
    marginRight: 8,
    fontWeight: '900',
  },
  cueText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: FONT.body,
  },
  cueTextEmpty: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: FONT.body,
  },
  // HUD Accents
  cornerTL: {
    position: 'absolute',
    top: 50,
    left: 15,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.5,
  },
  cornerTR: {
    position: 'absolute',
    top: 50,
    right: 15,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.5,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 30,
    left: 15,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.5,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 30,
    right: 15,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.accent,
    opacity: 0.5,
  },
});
