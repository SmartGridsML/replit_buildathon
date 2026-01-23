import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import AnimatedPressable from '../components/AnimatedPressable';

interface PoseMessage {
  exercise: string;
  repCount: number;
  cues: string[];
}

const exercises = [
  { id: 'squat', name: 'Squat', icon: '🏋️' },
  { id: 'pushup', name: 'Push-Up', icon: '💪' },
];

const formTips: Record<string, { cues: string[]; common: string[] }> = {
  squat: {
    cues: [
      'Keep your chest up and back straight',
      'Push your knees out over your toes',
      'Go as low as your mobility allows',
      'Drive through your heels to stand',
    ],
    common: [
      'Knees caving inward',
      'Heels lifting off the floor',
      'Leaning too far forward',
    ],
  },
  pushup: {
    cues: [
      'Keep your body in a straight line',
      'Lower your chest toward the floor',
      'Keep elbows at 45-degree angle',
      'Fully extend arms at the top',
    ],
    common: [
      'Sagging hips',
      'Flaring elbows out wide',
      'Not going low enough',
    ],
  },
};

export default function FormCoach() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [selectedExercise, setSelectedExercise] = useState('squat');
  const [repCount, setRepCount] = useState(0);
  const [liveCues, setLiveCues] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const currentTips = formTips[selectedExercise];
  const currentExercise = exercises.find((e) => e.id === selectedExercise);

  useEffect(() => {
    if (Platform.OS !== 'web' || !showCamera) return;
    
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as PoseMessage;
        if (typeof data.repCount === 'number') {
          setRepCount(data.repCount);
        }
        if (Array.isArray(data.cues)) {
          setLiveCues(data.cues.slice(0, 3));
        }
        if (!cameraActive) {
          setCameraActive(true);
        }
      } catch (error) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [showCamera, cameraActive]);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as PoseMessage;
      if (typeof data.repCount === 'number') {
        setRepCount(data.repCount);
      }
      if (Array.isArray(data.cues)) {
        setLiveCues(data.cues.slice(0, 3));
      }
      if (!cameraActive) {
        setCameraActive(true);
      }
    } catch (error) {
      // Ignore malformed messages
    }
  };

  const handleWebViewError = () => {
    setCameraError(true);
  };

  const toggleCamera = () => {
    if (showCamera) {
      setShowCamera(false);
      setCameraActive(false);
      setRepCount(0);
      setLiveCues([]);
    } else {
      setShowCamera(true);
      setCameraError(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 20) + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Form Coach</Text>
          <Text style={styles.headerSubtitle}>AI-powered form feedback</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.exerciseScroll}
          contentContainerStyle={styles.exerciseSelector}
        >
          {exercises.map((ex) => (
            <AnimatedPressable
              key={ex.id}
              style={[
                styles.exerciseTab,
                selectedExercise === ex.id && styles.exerciseTabActive,
              ]}
              onPress={() => {
                setSelectedExercise(ex.id);
                setRepCount(0);
                setLiveCues([]);
              }}
            >
              <Text style={styles.exerciseTabIcon}>{ex.icon}</Text>
              <Text
                style={[
                  styles.exerciseTabText,
                  selectedExercise === ex.id && styles.exerciseTabTextActive,
                ]}
              >
                {ex.name}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>

        {showCamera && !cameraError ? (
          <View style={styles.cameraSection}>
            <View style={styles.cameraContainer}>
              {Platform.OS === 'web' ? (
                <iframe
                  src={`/pose.html?exercise=${selectedExercise}`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="camera; microphone"
                  key={selectedExercise}
                />
              ) : (
                <WebView
                  ref={webViewRef}
                  source={{ uri: `file:///android_asset/pose.html?exercise=${selectedExercise}` }}
                  style={styles.webview}
                  javaScriptEnabled
                  originWhitelist={['*']}
                  mediaPlaybackRequiresUserAction={false}
                  allowsInlineMediaPlayback
                  onMessage={handleMessage}
                  onError={handleWebViewError}
                  onHttpError={handleWebViewError}
                />
              )}
              <View style={styles.cameraOverlay}>
                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statValue}>{repCount}</Text>
                    <Text style={styles.statLabel}>Reps</Text>
                  </View>
                  <View style={[styles.statusBadge, cameraActive && styles.statusBadgeActive]}>
                    <View style={[styles.statusDot, cameraActive && styles.statusDotActive]} />
                    <Text style={styles.statusText}>{cameraActive ? 'Tracking' : 'Starting...'}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {liveCues.length > 0 && (
              <View style={styles.liveCuesCard}>
                <Text style={styles.liveCuesTitle}>Live Feedback</Text>
                {liveCues.map((cue, idx) => (
                  <View key={idx} style={styles.liveCueItem}>
                    <Text style={styles.liveCueIcon}>
                      {cue.includes('Nice') || cue.includes('Full') ? '✓' : '→'}
                    </Text>
                    <Text style={styles.liveCueText}>{cue}</Text>
                  </View>
                ))}
              </View>
            )}

            <AnimatedPressable style={styles.stopButton} onPress={toggleCamera}>
              <Text style={styles.stopButtonText}>Stop Camera</Text>
            </AnimatedPressable>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroEmoji}>{currentExercise?.icon}</Text>
              <Text style={styles.heroTitle}>{currentExercise?.name}</Text>
              <Text style={styles.heroSubtitle}>
                {cameraError ? 'Camera not available' : 'Ready for form analysis'}
              </Text>
            </View>

            <AnimatedPressable style={styles.startButton} onPress={toggleCamera}>
              <Text style={styles.startButtonIcon}>📷</Text>
              <Text style={styles.startButtonText}>Start Camera Coaching</Text>
            </AnimatedPressable>

            {cameraError && (
              <View style={styles.errorCard}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>
                  Camera access requires a secure context (HTTPS) and browser permissions. 
                  Try opening in a standalone browser window.
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Form Cues</Text>
              {currentTips.cues.map((cue, idx) => (
                <View key={idx} style={styles.tipItem}>
                  <View style={styles.tipNumber}>
                    <Text style={styles.tipNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.tipText}>{cue}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Common Mistakes</Text>
              {currentTips.common.map((mistake, idx) => (
                <View key={idx} style={styles.mistakeItem}>
                  <Text style={styles.mistakeIcon}>⚠️</Text>
                  <Text style={styles.mistakeText}>{mistake}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>💡</Text>
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>Pro Tip</Text>
            <Text style={styles.noteText}>
              Stand 6-8 feet from camera with good lighting. Wear fitted clothing for best tracking.
            </Text>
          </View>
        </View>
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
  },
  exerciseScroll: {
    marginHorizontal: -24,
    marginBottom: 20,
  },
  exerciseSelector: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
  },
  exerciseTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  exerciseTabActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  exerciseTabIcon: {
    fontSize: 18,
  },
  exerciseTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.body,
  },
  exerciseTabTextActive: {
    color: COLORS.white,
  },
  cameraSection: {
    marginBottom: 24,
  },
  cameraContainer: {
    height: 400,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: '#0b0e12',
    marginBottom: 16,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0b0e12',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2CE6C1',
    fontFamily: FONT.heading,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONT.body,
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  statusBadgeActive: {
    backgroundColor: 'rgba(44, 230, 193, 0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
  },
  statusDotActive: {
    backgroundColor: '#2CE6C1',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: FONT.body,
  },
  liveCuesCard: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
  },
  liveCuesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT.body,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  liveCueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  liveCueIcon: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
  },
  liveCueText: {
    fontSize: 15,
    color: COLORS.white,
    fontFamily: FONT.body,
  },
  stopButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.body,
  },
  heroCard: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.md,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: FONT.heading,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT.body,
    marginTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.text,
    paddingVertical: 18,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 10,
    ...SHADOWS.md,
  },
  startButtonIcon: {
    fontSize: 20,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    fontFamily: FONT.body,
  },
  errorCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    alignItems: 'flex-start',
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#991B1B',
    fontFamily: FONT.body,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: FONT.body,
    lineHeight: 22,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    padding: 14,
    borderRadius: RADIUS.md,
    marginBottom: 8,
    gap: 12,
  },
  mistakeIcon: {
    fontSize: 16,
  },
  mistakeText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
    ...SHADOWS.sm,
  },
  noteIcon: {
    fontSize: 24,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    lineHeight: 20,
  },
});
