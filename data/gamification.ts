import { STORAGE_KEYS } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'workouts' | 'streak' | 'exercises' | 'learning';
  xp: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  workoutsCompleted: number;
  longestStreak: number;
  currentStreak: number;
  exercisesCompleted: number;
  topicsRead: number;
  unlockedAchievements: string[];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_workout',
    title: 'First Rep',
    description: 'Complete your first workout',
    icon: '🎯',
    requirement: 1,
    type: 'workouts',
    xp: 50,
  },
  {
    id: 'five_workouts',
    title: 'Getting Strong',
    description: 'Complete 5 workouts',
    icon: '💪',
    requirement: 5,
    type: 'workouts',
    xp: 100,
  },
  {
    id: 'ten_workouts',
    title: 'Dedicated',
    description: 'Complete 10 workouts',
    icon: '🏆',
    requirement: 10,
    type: 'workouts',
    xp: 200,
  },
  {
    id: 'twenty_five_workouts',
    title: 'Unstoppable',
    description: 'Complete 25 workouts',
    icon: '⚡',
    requirement: 25,
    type: 'workouts',
    xp: 500,
  },
  {
    id: 'fifty_workouts',
    title: 'Iron Will',
    description: 'Complete 50 workouts',
    icon: '🔥',
    requirement: 50,
    type: 'workouts',
    xp: 1000,
  },
  {
    id: 'streak_3',
    title: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    xp: 75,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🗓️',
    requirement: 7,
    type: 'streak',
    xp: 200,
  },
  {
    id: 'streak_14',
    title: 'Two Week Champion',
    description: 'Maintain a 14-day streak',
    icon: '👑',
    requirement: 14,
    type: 'streak',
    xp: 400,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🌟',
    requirement: 30,
    type: 'streak',
    xp: 1000,
  },
  {
    id: 'exercises_50',
    title: 'Exercise Explorer',
    description: 'Complete 50 exercises total',
    icon: '🏋️',
    requirement: 50,
    type: 'exercises',
    xp: 150,
  },
  {
    id: 'exercises_200',
    title: 'Rep Master',
    description: 'Complete 200 exercises total',
    icon: '💯',
    requirement: 200,
    type: 'exercises',
    xp: 500,
  },
  {
    id: 'learning_3',
    title: 'Knowledge Seeker',
    description: 'Read 3 educational topics',
    icon: '📚',
    requirement: 3,
    type: 'learning',
    xp: 50,
  },
  {
    id: 'learning_all',
    title: 'Fitness Scholar',
    description: 'Read all educational topics',
    icon: '🧠',
    requirement: 11,
    type: 'learning',
    xp: 300,
  },
];

export const LEVELS = [
  { level: 1, minXP: 0, title: 'Beginner' },
  { level: 2, minXP: 100, title: 'Novice' },
  { level: 3, minXP: 300, title: 'Apprentice' },
  { level: 4, minXP: 600, title: 'Intermediate' },
  { level: 5, minXP: 1000, title: 'Skilled' },
  { level: 6, minXP: 1500, title: 'Advanced' },
  { level: 7, minXP: 2200, title: 'Expert' },
  { level: 8, minXP: 3000, title: 'Master' },
  { level: 9, minXP: 4000, title: 'Champion' },
  { level: 10, minXP: 5500, title: 'Legend' },
];

export function getLevelFromXP(xp: number): { level: number; title: string; progress: number; nextLevelXP: number } {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
      break;
    }
  }
  
  const xpInCurrentLevel = xp - currentLevel.minXP;
  const xpNeededForNextLevel = nextLevel.minXP - currentLevel.minXP;
  const progress = xpNeededForNextLevel > 0 ? xpInCurrentLevel / xpNeededForNextLevel : 1;
  
  return {
    level: currentLevel.level,
    title: currentLevel.title,
    progress: Math.min(progress, 1),
    nextLevelXP: nextLevel.minXP,
  };
}

export async function loadUserStats(): Promise<UserStats> {
  try {
    const statsJson = await AsyncStorage.getItem(STORAGE_KEYS.stats);
    if (statsJson) {
      return JSON.parse(statsJson);
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  
  return {
    totalXP: 0,
    level: 1,
    workoutsCompleted: 0,
    longestStreak: 0,
    currentStreak: 0,
    exercisesCompleted: 0,
    topicsRead: 0,
    unlockedAchievements: [],
  };
}

export async function saveUserStats(stats: UserStats): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

export function checkNewAchievements(stats: UserStats): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (stats.unlockedAchievements.includes(achievement.id)) continue;
    
    let isUnlocked = false;
    
    switch (achievement.type) {
      case 'workouts':
        isUnlocked = stats.workoutsCompleted >= achievement.requirement;
        break;
      case 'streak':
        isUnlocked = stats.longestStreak >= achievement.requirement;
        break;
      case 'exercises':
        isUnlocked = stats.exercisesCompleted >= achievement.requirement;
        break;
      case 'learning':
        isUnlocked = stats.topicsRead >= achievement.requirement;
        break;
    }
    
    if (isUnlocked) {
      newlyUnlocked.push(achievement);
    }
  }
  
  return newlyUnlocked;
}

export async function awardXP(amount: number): Promise<{ newXP: number; levelUp: boolean; newLevel: number }> {
  const stats = await loadUserStats();
  const oldLevel = getLevelFromXP(stats.totalXP).level;
  
  stats.totalXP += amount;
  const newLevelInfo = getLevelFromXP(stats.totalXP);
  stats.level = newLevelInfo.level;
  
  await saveUserStats(stats);
  
  return {
    newXP: stats.totalXP,
    levelUp: newLevelInfo.level > oldLevel,
    newLevel: newLevelInfo.level,
  };
}

export async function recordWorkoutComplete(exerciseCount: number, currentStreak: number): Promise<{
  xpEarned: number;
  newAchievements: Achievement[];
  levelUp: boolean;
  newLevel: number;
}> {
  const stats = await loadUserStats();
  
  stats.workoutsCompleted += 1;
  stats.exercisesCompleted += exerciseCount;
  stats.currentStreak = currentStreak;
  stats.longestStreak = Math.max(stats.longestStreak, currentStreak);
  
  const newAchievements = checkNewAchievements(stats);
  let xpEarned = 25 + (exerciseCount * 5);
  
  for (const achievement of newAchievements) {
    xpEarned += achievement.xp;
    stats.unlockedAchievements.push(achievement.id);
  }
  
  const oldLevel = stats.level;
  stats.totalXP += xpEarned;
  const newLevelInfo = getLevelFromXP(stats.totalXP);
  stats.level = newLevelInfo.level;
  
  await saveUserStats(stats);
  
  return {
    xpEarned,
    newAchievements,
    levelUp: newLevelInfo.level > oldLevel,
    newLevel: newLevelInfo.level,
  };
}

export async function recordTopicRead(topicId: string): Promise<Achievement[]> {
  const readTopicsJson = await AsyncStorage.getItem(STORAGE_KEYS.readTopics);
  const readTopics: string[] = readTopicsJson ? JSON.parse(readTopicsJson) : [];
  
  if (readTopics.includes(topicId)) return [];
  
  readTopics.push(topicId);
  await AsyncStorage.setItem(STORAGE_KEYS.readTopics, JSON.stringify(readTopics));
  
  const stats = await loadUserStats();
  stats.topicsRead = readTopics.length;
  
  const newAchievements = checkNewAchievements(stats);
  let xpEarned = 10;
  
  for (const achievement of newAchievements) {
    xpEarned += achievement.xp;
    stats.unlockedAchievements.push(achievement.id);
  }
  
  stats.totalXP += xpEarned;
  stats.level = getLevelFromXP(stats.totalXP).level;
  
  await saveUserStats(stats);
  
  return newAchievements;
}
