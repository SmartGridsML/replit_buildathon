import { WeeklyPlan, UserProfile, Workout } from '../types';

const SCHEDULES: Record<number, string[]> = {
  3: ['Mon', 'Wed', 'Fri'],
  4: ['Mon', 'Tue', 'Thu', 'Sat'],
  5: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
};

const HOME_TEMPLATES: Record<string, Workout[]> = {
  strength: [
    {
      id: 'home_strength_1',
      title: 'Full Body A',
      focus: 'Squat + Push',
      dayLabel: 'Mon',
      exerciseIds: ['air_squat', 'push_up', 'glute_bridge', 'plank'],
    },
    {
      id: 'home_strength_2',
      title: 'Full Body B',
      focus: 'Lunge + Core',
      dayLabel: 'Wed',
      exerciseIds: ['reverse_lunge', 'dead_bug', 'hip_hinge', 'band_pull_apart'],
    },
    {
      id: 'home_strength_3',
      title: 'Full Body C',
      focus: 'Glutes + Core',
      dayLabel: 'Fri',
      exerciseIds: ['glute_bridge', 'incline_push_up', 'plank', 'air_squat'],
    },
  ],
  'fat-loss': [
    {
      id: 'home_fat_1',
      title: 'Metcon A',
      focus: 'Circuit',
      dayLabel: 'Mon',
      exerciseIds: ['air_squat', 'push_up', 'plank', 'reverse_lunge'],
    },
    {
      id: 'home_fat_2',
      title: 'Metcon B',
      focus: 'Cardio + Core',
      dayLabel: 'Wed',
      exerciseIds: ['glute_bridge', 'dead_bug', 'air_squat', 'band_pull_apart'],
    },
    {
      id: 'home_fat_3',
      title: 'Metcon C',
      focus: 'Legs + Push',
      dayLabel: 'Fri',
      exerciseIds: ['reverse_lunge', 'push_up', 'plank', 'hip_hinge'],
    },
  ],
  mobility: [
    {
      id: 'home_mob_1',
      title: 'Mobility Flow A',
      focus: 'Hips + Core',
      dayLabel: 'Mon',
      exerciseIds: ['hip_hinge', 'dead_bug', 'glute_bridge', 'plank'],
    },
    {
      id: 'home_mob_2',
      title: 'Mobility Flow B',
      focus: 'Shoulders + Spine',
      dayLabel: 'Wed',
      exerciseIds: ['band_pull_apart', 'plank', 'dead_bug', 'air_squat'],
    },
    {
      id: 'home_mob_3',
      title: 'Mobility Flow C',
      focus: 'Lower Body',
      dayLabel: 'Fri',
      exerciseIds: ['glute_bridge', 'hip_hinge', 'air_squat', 'dead_bug'],
    },
  ],
};

const GYM_TEMPLATES: Record<string, Workout[]> = {
  strength: [
    {
      id: 'gym_strength_1',
      title: 'Strength A',
      focus: 'Squat + Push',
      dayLabel: 'Mon',
      exerciseIds: ['goblet_squat', 'bench_press', 'dumbbell_row', 'plank'],
    },
    {
      id: 'gym_strength_2',
      title: 'Strength B',
      focus: 'Hinge + Pull',
      dayLabel: 'Wed',
      exerciseIds: ['romanian_deadlift', 'lat_pulldown', 'step_up', 'dead_bug'],
    },
    {
      id: 'gym_strength_3',
      title: 'Strength C',
      focus: 'Full Body',
      dayLabel: 'Fri',
      exerciseIds: ['goblet_squat', 'bench_press', 'dumbbell_row', 'band_pull_apart'],
    },
  ],
  'fat-loss': [
    {
      id: 'gym_fat_1',
      title: 'Conditioning A',
      focus: 'Full Body',
      dayLabel: 'Mon',
      exerciseIds: ['goblet_squat', 'bench_press', 'lat_pulldown', 'plank'],
    },
    {
      id: 'gym_fat_2',
      title: 'Conditioning B',
      focus: 'Legs + Core',
      dayLabel: 'Wed',
      exerciseIds: ['step_up', 'romanian_deadlift', 'dead_bug', 'band_pull_apart'],
    },
    {
      id: 'gym_fat_3',
      title: 'Conditioning C',
      focus: 'Push + Pull',
      dayLabel: 'Fri',
      exerciseIds: ['bench_press', 'dumbbell_row', 'plank', 'goblet_squat'],
    },
  ],
  mobility: [
    {
      id: 'gym_mob_1',
      title: 'Mobility A',
      focus: 'Hips + Spine',
      dayLabel: 'Mon',
      exerciseIds: ['hip_hinge', 'step_up', 'dead_bug', 'band_pull_apart'],
    },
    {
      id: 'gym_mob_2',
      title: 'Mobility B',
      focus: 'Shoulders + Core',
      dayLabel: 'Wed',
      exerciseIds: ['lat_pulldown', 'plank', 'band_pull_apart', 'glute_bridge'],
    },
    {
      id: 'gym_mob_3',
      title: 'Mobility C',
      focus: 'Lower Body',
      dayLabel: 'Fri',
      exerciseIds: ['goblet_squat', 'romanian_deadlift', 'dead_bug', 'hip_hinge'],
    },
  ],
};

const INJURY_SWAPS: Record<string, Record<string, string>> = {
  knee: {
    air_squat: 'glute_bridge',
    goblet_squat: 'step_up',
    reverse_lunge: 'glute_bridge',
    step_up: 'glute_bridge',
  },
  shoulder: {
    bench_press: 'incline_push_up',
    push_up: 'incline_push_up',
    lat_pulldown: 'band_pull_apart',
  },
  back: {
    romanian_deadlift: 'hip_hinge',
    hip_hinge: 'glute_bridge',
  },
};

function applyInjurySwaps(exerciseIds: string[], injuries: string[]): string[] {
  return exerciseIds.map((id) => {
    for (const injury of injuries) {
      const swap = INJURY_SWAPS[injury]?.[id];
      if (swap) {
        return swap;
      }
    }
    return id;
  });
}

function scheduleWorkouts(workouts: Workout[], count: number): Workout[] {
  const schedule = SCHEDULES[count] || SCHEDULES[3];
  const expanded: Workout[] = [];
  for (let i = 0; i < count; i += 1) {
    const template = workouts[i % workouts.length];
    expanded.push({
      ...template,
      id: `${template.id}_${i}`,
      title: `${template.title}`,
    });
  }
  return expanded.map((workout, index) => ({
    ...workout,
    dayLabel: schedule[index] || workout.dayLabel,
  }));
}

export function generateWeeklyPlan(profile: UserProfile): WeeklyPlan {
  const { goal, equipment, experience, injuries } = profile;
  const baseTemplates = equipment === 'gym' ? GYM_TEMPLATES : HOME_TEMPLATES;
  const templates = baseTemplates[goal] || HOME_TEMPLATES.strength;
  const count = experience === 'intermediate' ? 5 : 3;

  const scheduled = scheduleWorkouts(templates, count);
  const workouts = scheduled.map((workout) => ({
    ...workout,
    exerciseIds: applyInjurySwaps(workout.exerciseIds, injuries),
  }));

  return {
    id: `plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    workouts,
  };
}
