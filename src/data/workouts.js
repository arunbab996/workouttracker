export const WORKOUT_DAYS = {
  A: {
    name: 'Push',
    exercises: [
      { name: 'Slow push-ups', sets: 4, reps: '10–15', weight: 0 },
      { name: 'DB shoulder press', sets: 3, reps: '10–12', weight: 10 },
      { name: 'DB lateral raises', sets: 3, reps: '12–15', weight: 5 },
      { name: 'KB tricep overhead extension', sets: 3, reps: '12', weight: 12 },
      { name: 'Pike push-ups', sets: 3, reps: '8–10', weight: 0 },
    ],
  },
  B: {
    name: 'Pull',
    exercises: [
      { name: 'DB bent-over row', sets: 4, reps: '10–12', weight: 10 },
      { name: 'Single-arm DB row', sets: 3, reps: '10 each', weight: 10 },
      { name: 'DB reverse fly', sets: 3, reps: '12–15', weight: 5 },
      { name: 'DB bicep curl', sets: 3, reps: '10–12', weight: 10 },
      { name: 'KB deadlift', sets: 4, reps: '12', weight: 12 },
    ],
  },
  C: {
    name: 'Legs + Core',
    exercises: [
      { name: 'Goblet squat', sets: 4, reps: '12', weight: 12 },
      { name: 'DB Romanian deadlift', sets: 3, reps: '12', weight: 10 },
      { name: 'DB reverse lunge', sets: 3, reps: '10 each', weight: 5 },
      { name: 'Plank hold', sets: 3, reps: '45s', weight: 0 },
      { name: 'KB swing', sets: 4, reps: '15', weight: 12 },
    ],
  },
}

export const MICRO_MOVEMENTS = [
  { name: 'Goblet squat', detail: '12kg KB' },
  { name: 'KB swing', detail: '12kg' },
  { name: 'Push-up', detail: 'bodyweight' },
]

export const MOTIVATIONAL_LINES = [
  'Dread is always worse than the thing itself.',
  'Energy comes after you start, not before.',
  "You don't need to feel like it. You just need to begin.",
  'The first rep is the only hard one.',
  '5 minutes is enough. Showing up is the whole point.',
  'Your future self is already grateful.',
  'Motion creates motivation. Not the other way around.',
  "You've done harder things than this.",
]
