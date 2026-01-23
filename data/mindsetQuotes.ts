export interface MindsetQuote {
  id: string;
  text: string;
  author: string;
  attribution: string;
  category: 'motivation' | 'discipline' | 'resilience' | 'growth' | 'focus';
}

export const mindsetQuotes: MindsetQuote[] = [
  {
    id: 'aurelius-001',
    text: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    attribution: 'Meditations (Public Domain)',
    category: 'resilience',
  },
  {
    id: 'aurelius-002',
    text: 'Waste no more time arguing about what a good man should be. Be one.',
    author: 'Marcus Aurelius',
    attribution: 'Meditations (Public Domain)',
    category: 'discipline',
  },
  {
    id: 'aurelius-003',
    text: 'The impediment to action advances action. What stands in the way becomes the way.',
    author: 'Marcus Aurelius',
    attribution: 'Meditations (Public Domain)',
    category: 'resilience',
  },
  {
    id: 'seneca-001',
    text: 'It is not that we have a short time to live, but that we waste a lot of it.',
    author: 'Seneca',
    attribution: 'On the Shortness of Life (Public Domain)',
    category: 'discipline',
  },
  {
    id: 'seneca-002',
    text: 'Difficulties strengthen the mind, as labor does the body.',
    author: 'Seneca',
    attribution: 'Letters from a Stoic (Public Domain)',
    category: 'growth',
  },
  {
    id: 'epictetus-001',
    text: 'First say to yourself what you would be; and then do what you have to do.',
    author: 'Epictetus',
    attribution: 'Discourses (Public Domain)',
    category: 'focus',
  },
  {
    id: 'epictetus-002',
    text: 'No man is free who is not master of himself.',
    author: 'Epictetus',
    attribution: 'Discourses (Public Domain)',
    category: 'discipline',
  },
  {
    id: 'lao-tzu-001',
    text: 'A journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
    attribution: 'Tao Te Ching (Public Domain)',
    category: 'motivation',
  },
  {
    id: 'lao-tzu-002',
    text: 'He who conquers others is strong; he who conquers himself is mighty.',
    author: 'Lao Tzu',
    attribution: 'Tao Te Ching (Public Domain)',
    category: 'discipline',
  },
  {
    id: 'confucius-001',
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    attribution: 'Analects (Public Domain)',
    category: 'resilience',
  },
  {
    id: 'buddha-001',
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    attribution: 'Dhammapada (Public Domain)',
    category: 'focus',
  },
  {
    id: 'buddha-002',
    text: 'Health is the greatest gift, contentment the greatest wealth.',
    author: 'Buddha',
    attribution: 'Dhammapada (Public Domain)',
    category: 'growth',
  },
  {
    id: 'plato-001',
    text: 'Lack of activity destroys the good condition of every human being.',
    author: 'Plato',
    attribution: 'Theaetetus (Public Domain)',
    category: 'motivation',
  },
  {
    id: 'aristotle-001',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    author: 'Aristotle',
    attribution: 'Nicomachean Ethics (Public Domain)',
    category: 'discipline',
  },
  {
    id: 'aristotle-002',
    text: 'The soul never thinks without a picture.',
    author: 'Aristotle',
    attribution: 'De Anima (Public Domain)',
    category: 'focus',
  },
  {
    id: 'emerson-001',
    text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
    attribution: 'Essays (Public Domain)',
    category: 'resilience',
  },
  {
    id: 'thoreau-001',
    text: 'Go confidently in the direction of your dreams. Live the life you have imagined.',
    author: 'Henry David Thoreau',
    attribution: 'Walden (Public Domain)',
    category: 'motivation',
  },
  {
    id: 'roosevelt-001',
    text: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt',
    attribution: 'Public Domain',
    category: 'motivation',
  },
  {
    id: 'musashi-001',
    text: 'There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.',
    author: 'Miyamoto Musashi',
    attribution: 'The Book of Five Rings (Public Domain)',
    category: 'growth',
  },
  {
    id: 'musashi-002',
    text: 'Today is victory over yourself of yesterday; tomorrow is your victory over lesser men.',
    author: 'Miyamoto Musashi',
    attribution: 'The Book of Five Rings (Public Domain)',
    category: 'discipline',
  },
  {
    id: 'sun-tzu-001',
    text: 'Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.',
    author: 'Sun Tzu',
    attribution: 'The Art of War (Public Domain)',
    category: 'focus',
  },
  {
    id: 'proverb-001',
    text: 'Fall seven times, stand up eight.',
    author: 'Japanese Proverb',
    attribution: 'Traditional (Public Domain)',
    category: 'resilience',
  },
  {
    id: 'proverb-002',
    text: 'The best time to plant a tree was twenty years ago. The second best time is now.',
    author: 'Chinese Proverb',
    attribution: 'Traditional (Public Domain)',
    category: 'motivation',
  },
  {
    id: 'pinnacle-001',
    text: 'Your body can stand almost anything. It is your mind you have to convince.',
    author: 'Pinnacle',
    attribution: 'Original',
    category: 'resilience',
  },
  {
    id: 'pinnacle-002',
    text: 'Slow. Strong. Stable.',
    author: 'Pinnacle',
    attribution: 'Original',
    category: 'focus',
  },
  {
    id: 'pinnacle-003',
    text: 'You showed up. That is the hardest part.',
    author: 'Pinnacle',
    attribution: 'Original',
    category: 'motivation',
  },
];

export const preWorkoutMantras = [
  'Breathe. Brace. Control.',
  'Slow. Strong. Stable.',
  'Focus. Flow. Finish.',
  'Present. Powerful. Patient.',
  'Calm. Clear. Committed.',
];

export const postWorkoutReflections = [
  'You showed up today. That is everything.',
  'Stronger than yesterday. Preparing for tomorrow.',
  'The work is done. The growth is earned.',
  'Rest now. Rise again.',
  'One step closer to your peak.',
];

export function getDailyQuote(): MindsetQuote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return mindsetQuotes[dayOfYear % mindsetQuotes.length];
}

export function getRandomQuote(): MindsetQuote {
  return mindsetQuotes[Math.floor(Math.random() * mindsetQuotes.length)];
}

export function getPreWorkoutMantra(): string {
  return preWorkoutMantras[Math.floor(Math.random() * preWorkoutMantras.length)];
}

export function getPostWorkoutReflection(): string {
  return postWorkoutReflections[Math.floor(Math.random() * postWorkoutReflections.length)];
}

export function getQuotesByCategory(category: MindsetQuote['category']): MindsetQuote[] {
  return mindsetQuotes.filter(q => q.category === category);
}
