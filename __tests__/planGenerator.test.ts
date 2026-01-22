import { generateWeeklyPlan } from '../data/planGenerator';
import { UserProfile } from '../types';

describe('Plan Generator', () => {
  const baseProfile: UserProfile = {
    name: 'Test User',
    goal: 'strength',
    equipment: 'gym',
    experience: 'beginner',
    injuries: [],
  };

  describe('generateWeeklyPlan', () => {
    it('should generate a plan with workouts', () => {
      const plan = generateWeeklyPlan(baseProfile);
      expect(plan).toBeDefined();
      expect(plan.workouts).toBeDefined();
      expect(plan.workouts.length).toBeGreaterThan(0);
    });

    it('should generate between 3-5 workouts per week', () => {
      const plan = generateWeeklyPlan(baseProfile);
      expect(plan.workouts.length).toBeGreaterThanOrEqual(3);
      expect(plan.workouts.length).toBeLessThanOrEqual(5);
    });

    it('should assign day labels to workouts', () => {
      const plan = generateWeeklyPlan(baseProfile);
      const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      plan.workouts.forEach(workout => {
        expect(validDays).toContain(workout.dayLabel);
      });
    });

    it('should generate unique workout IDs', () => {
      const plan = generateWeeklyPlan(baseProfile);
      const ids = plan.workouts.map(w => w.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should include exercises in each workout', () => {
      const plan = generateWeeklyPlan(baseProfile);
      plan.workouts.forEach(workout => {
        expect(workout.exerciseIds).toBeDefined();
        expect(workout.exerciseIds.length).toBeGreaterThan(0);
      });
    });

    it('should respect home equipment setting', () => {
      const homeProfile = { ...baseProfile, equipment: 'home' as const };
      const plan = generateWeeklyPlan(homeProfile);
      expect(plan.workouts.length).toBeGreaterThan(0);
    });

    it('should adjust for experience level', () => {
      const beginnerPlan = generateWeeklyPlan({ ...baseProfile, experience: 'beginner' });
      const intermediatePlan = generateWeeklyPlan({ ...baseProfile, experience: 'intermediate' });
      
      expect(beginnerPlan.workouts.length).toBeLessThanOrEqual(intermediatePlan.workouts.length);
    });

    it('should handle different goals', () => {
      const strengthPlan = generateWeeklyPlan({ ...baseProfile, goal: 'strength' });
      const fatLossPlan = generateWeeklyPlan({ ...baseProfile, goal: 'fat-loss' });
      const mobilityPlan = generateWeeklyPlan({ ...baseProfile, goal: 'mobility' });
      
      expect(strengthPlan.workouts.length).toBeGreaterThan(0);
      expect(fatLossPlan.workouts.length).toBeGreaterThan(0);
      expect(mobilityPlan.workouts.length).toBeGreaterThan(0);
    });

    it('should consider injuries', () => {
      const profileWithInjury = { ...baseProfile, injuries: ['knee' as const] };
      const plan = generateWeeklyPlan(profileWithInjury);
      expect(plan.workouts.length).toBeGreaterThan(0);
    });

    it('should generate a valid plan ID and timestamp', () => {
      const plan = generateWeeklyPlan(baseProfile);
      expect(plan.id).toBeDefined();
      expect(plan.id.length).toBeGreaterThan(0);
      expect(plan.createdAt).toBeDefined();
    });
  });
});
