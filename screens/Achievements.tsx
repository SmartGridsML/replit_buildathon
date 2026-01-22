import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ACHIEVEMENTS, Achievement, UserStats, loadUserStats, getLevelFromXP, LEVELS } from '../data/gamification';
import { COLORS, FONT, RADIUS, SHADOWS } from '../theme';
import ScreenBackground from '../components/ScreenBackground';

export default function Achievements() {
  const navigation = useNavigation();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [levelInfo, setLevelInfo] = useState({ level: 1, title: 'Beginner', progress: 0, nextLevelXP: 100 });

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const s = await loadUserStats();
        setStats(s);
        setLevelInfo(getLevelFromXP(s.totalXP));
      };
      load();
    }, [])
  );

  const isUnlocked = (achievement: Achievement) => 
    stats?.unlockedAchievements.includes(achievement.id) || false;

  const getProgress = (achievement: Achievement): number => {
    if (!stats) return 0;
    let current = 0;
    switch (achievement.type) {
      case 'workouts':
        current = stats.workoutsCompleted;
        break;
      case 'streak':
        current = stats.longestStreak;
        break;
      case 'exercises':
        current = stats.exercisesCompleted;
        break;
      case 'learning':
        current = stats.topicsRead;
        break;
    }
    return Math.min(current / achievement.requirement, 1);
  };

  return (
    <ScreenBackground>
      <ScrollView style={styles.root} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.title}>Achievements</Text>
        </View>

        <View style={styles.levelCard}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{levelInfo.level}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>{levelInfo.title}</Text>
            <Text style={styles.xpText}>{stats?.totalXP || 0} XP</Text>
            <View style={styles.levelProgressBg}>
              <View style={[styles.levelProgressFill, { width: `${levelInfo.progress * 100}%` }]} />
            </View>
            <Text style={styles.nextLevelText}>
              {levelInfo.level < 10 
                ? `${levelInfo.nextLevelXP - (stats?.totalXP || 0)} XP to Level ${levelInfo.level + 1}`
                : 'Max Level Reached!'
              }
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.workoutsCompleted || 0}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.longestStreak || 0}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.exercisesCompleted || 0}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.unlockedAchievements.length || 0}/{ACHIEVEMENTS.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Badges</Text>
        
        <View style={styles.achievementsList}>
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = isUnlocked(achievement);
            const progress = getProgress(achievement);
            
            return (
              <View key={achievement.id} style={[styles.achievementCard, !unlocked && styles.achievementLocked]}>
                <View style={[styles.achievementIcon, unlocked && styles.achievementIconUnlocked]}>
                  <Text style={styles.achievementEmoji}>{unlocked ? achievement.icon : '🔒'}</Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[styles.achievementTitle, !unlocked && styles.achievementTitleLocked]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDesc}>{achievement.description}</Text>
                  {!unlocked && (
                    <View style={styles.achievementProgressBg}>
                      <View style={[styles.achievementProgressFill, { width: `${progress * 100}%` }]} />
                    </View>
                  )}
                </View>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpBadgeText}>+{achievement.xp} XP</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  backArrow: {
    fontSize: 24,
    color: COLORS.text,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  levelCard: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.md,
  },
  levelBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.accent,
    fontFamily: FONT.heading,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    fontFamily: FONT.heading,
  },
  xpText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT.body,
    marginTop: 2,
  },
  levelProgressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 3,
  },
  nextLevelText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONT.body,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT.heading,
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  achievementLocked: {
    opacity: 0.7,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  achievementIconUnlocked: {
    backgroundColor: COLORS.successLight,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: FONT.heading,
  },
  achievementTitleLocked: {
    color: COLORS.textSecondary,
  },
  achievementDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: FONT.body,
    marginTop: 2,
  },
  achievementProgressBg: {
    height: 4,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 2,
  },
  xpBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    marginLeft: 8,
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.accent,
    fontFamily: FONT.body,
  },
});
