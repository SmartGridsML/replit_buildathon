export type Goal = 'strength' | 'fat-loss' | 'mobility';
export type Equipment = 'home' | 'gym';
export type Experience = 'beginner' | 'intermediate';
export type Injury = 'knee' | 'shoulder' | 'back';

export interface UserProfile {
  name: string;
  goal: Goal;
  equipment: Equipment;
  experience: Experience;
  injuries: Injury[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  muscleGroups?: string[];
}

export interface Workout {
  id: string;
  title: string;
  focus: string;
  dayLabel: string;
  exerciseIds: string[];
}

export interface WeeklyPlan {
  id: string;
  createdAt: string;
  workouts: Workout[];
}

export interface LearnTopic {
  id: string;
  title: string;
  category: 'muscles' | 'injuries' | 'nutrition' | 'recovery';
  icon: string;
  summary: string;
  content: string;
}
