import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Workout } from '../types';
import { recordWorkoutComplete, Achievement } from '../data/gamification';
import { getPostWorkoutReflection } from '../data/mindsetQuotes';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';
import FocusCard from '../components/FocusCard';

interface RouteParams {
  workout: Workout;
  exerciseCount: number;
  currentStreak?: number;
}

export default function WorkoutComplete() {
  const navigation = useNavigation();
  const route = useRoute();
  const { workout, exerciseCount, currentStreak = 1 } = (route.params as RouteParams) || {};

  const [xpEarned, setXpEarned] = useState(0);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [levelUp, setLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [reflection] = useState(getPostWorkoutReflection());

  useEffect(() => {
    const recordCompletion = async () => {
      const result = await recordWorkoutComplete(exerciseCount || 0, currentStreak);
      setXpEarned(result.xpEarned);
      setNewAchievements(result.newAchievements);
      setLevelUp(result.levelUp);
      setNewLevel(result.newLevel);
    };
    recordCompletion();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' as never }],
    });
  };

  return (
    <ScreenBackground>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.title}>Workout Complete!</Text>
          <Text style={styles.subtitle}>Great job finishing your session</Text>
        </View>

        <View style={styles.xpCard}>
          <Text style={styles.xpLabel}>XP Earned</Text>
          <Text style={styles.xpValue}>+{xpEarned}</Text>
          {levelUp && (
            <View style={styles.levelUpBadge}>
              <Text style={styles.levelUpText}>🎖️ Level Up! Now Level {newLevel}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exerciseCount || 0}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak 🔥</Text>
          </View>
        </View>

        {newAchievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={styles.achievementsTitle}>🏆 New Badges!</Text>
            {newAchievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{achievement.title}</Text>
                  <Text style={styles.achievementDesc}>{achievement.description}</Text>
                </View>
                <Text style={styles.achievementXP}>+{achievement.xp} XP</Text>
              </View>
            ))}
          </View>
        )}

        <FocusCard 
          mantra={reflection} 
          variant="post"
          subtitle="You earned this moment"
        />

        <Pressable style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </Animated.View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
  },
  xpCard: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.md,
  },
  xpLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT.body,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  xpValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: FONT.heading,
  },
  levelUpBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  levelUpText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    fontFamily: FONT.body,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
  },
  achievementsSection: {
    width: '100%',
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 12,
    textAlign: 'center',
  },
  achievementCard: {
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  achievementDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONT.body,
  },
  achievementXP: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
    fontFamily: FONT.body,
  },
  reflectionContainer: {
    width: '100%',
    marginBottom: 24,
  },
  doneButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: RADIUS.full,
    ...SHADOWS.md,
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT.body,
  },
});
