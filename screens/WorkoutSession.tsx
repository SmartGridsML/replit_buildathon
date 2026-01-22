import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types';
import { EXERCISES } from '../data/exercises';
import { STORAGE_KEYS } from '../data/storage';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import AnimatedPressable from '../components/AnimatedPressable';

interface RouteParams {
  workout: Workout;
}

export default function WorkoutSession() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { workout } = (route.params as RouteParams) || { workout: null };

  const exercises = workout?.exerciseIds.map(id => 
    EXERCISES.find(e => e.id === id)
  ).filter(Boolean) || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [maxTime, setMaxTime] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  const progressAnim = useRef(new Animated.Value(1)).current;

  const currentExercise = exercises[currentIndex];
  const totalExercises = exercises.length;

  useEffect(() => {
    progressAnim.setValue(timer / maxTime);
  }, [timer, maxTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (isResting) {
      setIsResting(false);
      setTimer(30);
      setMaxTime(30);
    } else {
      if (currentExercise) {
        setCompletedExercises(prev => [...prev, currentExercise.id]);
      }
      if (currentIndex < totalExercises - 1) {
        setIsResting(true);
        setTimer(15);
        setMaxTime(15);
        setIsRunning(true);
      } else {
        handleWorkoutComplete();
      }
    }
  };

  const handleWorkoutComplete = async () => {
    const completedWorkouts = await AsyncStorage.getItem(STORAGE_KEYS.completed);
    const completed = completedWorkouts ? JSON.parse(completedWorkouts) : [];
    completed.push({
      workoutId: workout?.id,
      completedAt: new Date().toISOString(),
      exerciseCount: totalExercises,
    });
    await AsyncStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(completed));
    
    const currentStreak = calculateStreak(completed);
    (navigation as any).navigate('WorkoutComplete', { workout, exerciseCount: totalExercises, currentStreak });
  };
  
  const calculateStreak = (completedWorkouts: any[]): number => {
    if (!completedWorkouts || completedWorkouts.length === 0) return 1;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedDates = completedWorkouts
      .map(w => {
        const d = new Date(w.completedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => b - a);

    let streak = 0;
    let checkDate = today.getTime();

    for (const date of sortedDates) {
      if (date === checkDate || date === checkDate - 86400000) {
        streak++;
        checkDate = date;
      } else if (date < checkDate - 86400000) {
        break;
      }
    }

    return Math.max(streak, 1);
  };

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const nextExercise = () => {
    if (currentIndex < totalExercises - 1) {
      if (currentExercise) {
        setCompletedExercises(prev => [...prev, currentExercise.id]);
      }
      setCurrentIndex(prev => prev + 1);
      setTimer(30);
      setMaxTime(30);
      setIsRunning(false);
      setIsResting(false);
    } else {
      handleWorkoutComplete();
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setCurrentIndex(prev => prev + 1);
    setTimer(30);
    setMaxTime(30);
    setIsRunning(false);
  };

  if (!workout || exercises.length === 0) {
    return (
      <ScreenBackground>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No workout selected</Text>
          <Pressable style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </ScreenBackground>
    );
  }

  const progress = timer / maxTime;
  const progressDegrees = progress * 360;
  const activeColor = isResting ? COLORS.textMuted : COLORS.accent;

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
          <Text style={styles.headerTitle}>{workout.title}</Text>
          <Text style={styles.headerProgress}>{currentIndex + 1}/{totalExercises}</Text>
        </View>

        <View style={styles.exerciseDisplay}>
          <Text style={styles.exerciseName}>
            {isResting ? '😮‍💨 Rest' : currentExercise?.name || ''}
          </Text>
          {!isResting && currentExercise && (
            <Text style={styles.exerciseReps}>30 seconds</Text>
          )}
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.timerRing}>
            <View style={[styles.timerTrack, { borderColor: COLORS.borderLight }]} />
            <View 
              style={[
                styles.timerProgress,
                { 
                  borderColor: activeColor,
                  borderRightColor: progressDegrees > 180 ? activeColor : 'transparent',
                  borderBottomColor: progressDegrees > 90 ? activeColor : 'transparent',
                  borderLeftColor: progressDegrees > 270 ? activeColor : 'transparent',
                  transform: [{ rotate: '-90deg' }],
                }
              ]} 
            />
            <View style={styles.timerInner}>
              <Text style={[styles.timerValue, { color: activeColor }]}>{timer}</Text>
              <Text style={styles.timerUnit}>seconds</Text>
            </View>
            <View 
              style={[
                styles.progressDot,
                { 
                  backgroundColor: activeColor,
                  transform: [
                    { rotate: `${-90 + (1 - progress) * 360}deg` },
                    { translateX: 90 },
                  ],
                }
              ]} 
            />
          </View>
        </View>

        {!isResting && currentExercise && (
          <View style={styles.cueContainer}>
            <Text style={styles.cueText}>{currentExercise.description}</Text>
          </View>
        )}

        <View style={styles.controlsRow}>
          <AnimatedPressable 
            style={[styles.controlButton, styles.pauseButton]}
            onPress={toggleTimer}
          >
            <Text style={styles.controlButtonText}>{isRunning ? '⏸ Pause' : '▶ Start'}</Text>
          </AnimatedPressable>
          <AnimatedPressable 
            style={[styles.controlButton, styles.nextButton]}
            onPress={isResting ? skipRest : nextExercise}
          >
            <Text style={styles.controlButtonTextDark}>{isResting ? 'Skip →' : 'Next →'}</Text>
          </AnimatedPressable>
        </View>

        {!isResting && currentIndex < totalExercises - 1 && (
          <View style={styles.nextExercise}>
            <Text style={styles.nextLabel}>next:</Text>
            <Text style={styles.nextName}>{exercises[currentIndex + 1]?.name || ''}</Text>
          </View>
        )}

        <View style={styles.exerciseList}>
          <Text style={styles.listTitle}>Exercises</Text>
          {exercises.map((exercise, idx) => (
            <View key={exercise?.id || idx} style={styles.exerciseItem}>
              <View style={[
                styles.exerciseCheck,
                completedExercises.includes(exercise?.id || '') && styles.exerciseCheckDone,
                idx === currentIndex && !isResting && styles.exerciseCheckActive,
              ]}>
                {completedExercises.includes(exercise?.id || '') && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </View>
              <Text style={[
                styles.exerciseItemText,
                completedExercises.includes(exercise?.id || '') && styles.exerciseItemDone,
                idx === currentIndex && !isResting && styles.exerciseItemActive,
              ]}>
                {exercise?.name || ''}
              </Text>
            </View>
          ))}
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
  headerProgress: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  exerciseDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    textAlign: 'center',
  },
  exerciseReps: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  timerRing: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timerTrack: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
  },
  timerProgress: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    borderTopColor: 'currentColor',
  },
  timerInner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    width: 160,
    height: 160,
    borderRadius: 80,
    ...SHADOWS.sm,
  },
  timerValue: {
    fontSize: 56,
    fontWeight: '700',
    fontFamily: FONT.heading,
  },
  timerUnit: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginTop: -4,
  },
  progressDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -8,
  },
  cueContainer: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 24,
  },
  cueText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 18,
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
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
  controlButtonTextDark: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
  nextExercise: {
    alignItems: 'center',
    marginBottom: 32,
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
  exerciseList: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  exerciseCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseCheckDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  exerciseCheckActive: {
    borderColor: COLORS.accent,
    borderWidth: 3,
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseItemText: {
    fontSize: 15,
    color: COLORS.text,
    fontFamily: FONT.body,
  },
  exerciseItemDone: {
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  exerciseItemActive: {
    fontWeight: '600',
    color: COLORS.accent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  goBackButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: RADIUS.full,
  },
  goBackButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
