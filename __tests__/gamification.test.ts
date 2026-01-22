import { getLevelFromXP, checkNewAchievements, ACHIEVEMENTS, LEVELS, UserStats } from '../data/gamification';

describe('Gamification System', () => {
  describe('getLevelFromXP', () => {
    it('should return level 1 for 0 XP', () => {
      const result = getLevelFromXP(0);
      expect(result.level).toBe(1);
      expect(result.title).toBe('Beginner');
      expect(result.progress).toBe(0);
    });

    it('should return level 2 for 100 XP', () => {
      const result = getLevelFromXP(100);
      expect(result.level).toBe(2);
      expect(result.title).toBe('Novice');
    });

    it('should return level 3 for 300 XP', () => {
      const result = getLevelFromXP(300);
      expect(result.level).toBe(3);
      expect(result.title).toBe('Apprentice');
    });

    it('should calculate progress correctly', () => {
      const result = getLevelFromXP(50);
      expect(result.level).toBe(1);
      expect(result.progress).toBe(0.5);
    });

    it('should return level 10 for max XP', () => {
      const result = getLevelFromXP(10000);
      expect(result.level).toBe(10);
      expect(result.title).toBe('Legend');
    });
  });

  describe('checkNewAchievements', () => {
    const baseStats: UserStats = {
      totalXP: 0,
      level: 1,
      workoutsCompleted: 0,
      longestStreak: 0,
      currentStreak: 0,
      exercisesCompleted: 0,
      topicsRead: 0,
      unlockedAchievements: [],
    };

    it('should unlock first_workout achievement after 1 workout', () => {
      const stats = { ...baseStats, workoutsCompleted: 1 };
      const newAchievements = checkNewAchievements(stats);
      expect(newAchievements.some(a => a.id === 'first_workout')).toBe(true);
    });

    it('should not unlock already unlocked achievements', () => {
      const stats = { 
        ...baseStats, 
        workoutsCompleted: 1,
        unlockedAchievements: ['first_workout']
      };
      const newAchievements = checkNewAchievements(stats);
      expect(newAchievements.some(a => a.id === 'first_workout')).toBe(false);
    });

    it('should unlock streak achievements', () => {
      const stats = { ...baseStats, longestStreak: 7 };
      const newAchievements = checkNewAchievements(stats);
      expect(newAchievements.some(a => a.id === 'streak_3')).toBe(true);
      expect(newAchievements.some(a => a.id === 'streak_7')).toBe(true);
    });

    it('should unlock learning achievements', () => {
      const stats = { ...baseStats, topicsRead: 3 };
      const newAchievements = checkNewAchievements(stats);
      expect(newAchievements.some(a => a.id === 'learning_3')).toBe(true);
    });

    it('should unlock multiple achievements at once', () => {
      const stats = { 
        ...baseStats, 
        workoutsCompleted: 5,
        longestStreak: 3,
        exercisesCompleted: 50,
      };
      const newAchievements = checkNewAchievements(stats);
      expect(newAchievements.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('ACHIEVEMENTS data', () => {
    it('should have unique IDs', () => {
      const ids = ACHIEVEMENTS.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid XP values', () => {
      ACHIEVEMENTS.forEach(achievement => {
        expect(achievement.xp).toBeGreaterThan(0);
      });
    });

    it('should have valid types', () => {
      const validTypes = ['workouts', 'streak', 'exercises', 'learning'];
      ACHIEVEMENTS.forEach(achievement => {
        expect(validTypes).toContain(achievement.type);
      });
    });
  });

  describe('LEVELS data', () => {
    it('should have 10 levels', () => {
      expect(LEVELS.length).toBe(10);
    });

    it('should have increasing XP requirements', () => {
      for (let i = 1; i < LEVELS.length; i++) {
        expect(LEVELS[i].minXP).toBeGreaterThan(LEVELS[i - 1].minXP);
      }
    });

    it('should start at level 1 with 0 XP', () => {
      expect(LEVELS[0].level).toBe(1);
      expect(LEVELS[0].minXP).toBe(0);
    });
  });
});
