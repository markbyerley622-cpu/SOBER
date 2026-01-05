import { Task } from '@/types';

// Pre-defined sobriety tasks
// Rewards are in $SOBER tokens, ranging from 10,000 to 100,000 tokens per task
export const TASKS: Task[] = [
  // Alcohol-Free Tasks
  {
    id: 'alcohol-clear-space',
    title: 'Environment Reset',
    description: 'Clear your living space of alcohol. Upload a photo showing your alcohol-free environment.',
    category: 'alcohol-free',
    rewardAmount: 30000, // $SOBER tokens
    difficulty: 'medium',
    proofType: 'image',
    status: 'available',
    completedCount: 1247,
    icon: '/bad no drinking.jpg',
  },
  {
    id: 'alcohol-7-day-streak',
    title: '7-Day Alcohol Free',
    description: 'Complete 7 consecutive daily check-ins without alcohol consumption.',
    category: 'alcohol-free',
    rewardAmount: 50000, // $SOBER tokens
    difficulty: 'medium',
    proofType: 'streak',
    status: 'available',
    completedCount: 892,
    icon: '/bad no drinking.jpg',
  },
  {
    id: 'alcohol-30-day-streak',
    title: '30-Day Milestone',
    description: 'Achieve 30 days of sobriety. A major milestone in your journey!',
    category: 'alcohol-free',
    rewardAmount: 100000, // $SOBER tokens - bonus for major milestone
    difficulty: 'hard',
    proofType: 'streak',
    status: 'locked',
    completedCount: 324,
    icon: '/good winning.jpg',
  },

  // Smoke-Free Tasks
  {
    id: 'smoke-clear-space',
    title: 'Smoke-Free Zone',
    description: 'Remove all smoking materials from your space. Upload proof of your clean environment.',
    category: 'smoke-free',
    rewardAmount: 30000, // $SOBER tokens
    difficulty: 'medium',
    proofType: 'image',
    status: 'available',
    completedCount: 956,
    icon: '/good 7days sober.jpg',
  },
  {
    id: 'smoke-7-day-streak',
    title: '7-Day Smoke Free',
    description: 'Complete 7 consecutive days without smoking. Daily check-ins required.',
    category: 'smoke-free',
    rewardAmount: 50000, // $SOBER tokens
    difficulty: 'medium',
    proofType: 'streak',
    status: 'available',
    completedCount: 678,
    icon: '/good 7days sober.jpg',
  },

  // Fitness Tasks
  {
    id: 'fitness-workout',
    title: 'Healthy Body Challenge',
    description: 'Complete a workout session. Upload a gym selfie or workout screenshot.',
    category: 'fitness',
    rewardAmount: 20000, // $SOBER tokens
    difficulty: 'easy',
    proofType: 'image',
    status: 'available',
    completedCount: 2341,
    icon: '/gym good.jpg',
  },
  {
    id: 'fitness-7-day-active',
    title: '7-Day Active Streak',
    description: 'Exercise for 7 consecutive days. Any form of physical activity counts!',
    category: 'fitness',
    rewardAmount: 40000, // $SOBER tokens
    difficulty: 'medium',
    proofType: 'streak',
    status: 'available',
    completedCount: 1123,
    icon: '/gym good.jpg',
  },

  // Mindfulness Tasks
  {
    id: 'mindfulness-meditation',
    title: 'Mindful Moment',
    description: 'Complete a 10-minute meditation session. Upload a screenshot from your meditation app.',
    category: 'mindfulness',
    rewardAmount: 15000, // $SOBER tokens
    difficulty: 'easy',
    proofType: 'image',
    status: 'available',
    completedCount: 1876,
    icon: '/water good.jpg',
  },
  {
    id: 'mindfulness-journal',
    title: 'Reflection Journal',
    description: 'Write about your sobriety journey. Share your wins and challenges (privacy-safe).',
    category: 'mindfulness',
    rewardAmount: 20000, // $SOBER tokens
    difficulty: 'easy',
    proofType: 'image',
    status: 'available',
    completedCount: 1432,
    icon: '/water good.jpg',
  },

  // Community Tasks
  {
    id: 'community-referral',
    title: 'Sober Buddy Referral',
    description: 'Refer a friend who joins and completes their first task. Stronger together!',
    category: 'community',
    rewardAmount: 50000, // $SOBER tokens
    difficulty: 'medium',
    proofType: 'referral',
    status: 'available',
    completedCount: 567,
    icon: '/community.jpg',
  },
  {
    id: 'community-share-story',
    title: 'Share Your Story',
    description: 'Share your sobriety journey on social media (Twitter/X). Inspire others!',
    category: 'community',
    rewardAmount: 30000, // $SOBER tokens
    difficulty: 'easy',
    proofType: 'image',
    status: 'available',
    completedCount: 789,
    icon: '/community.jpg',
  },

  // Accountability Tasks
  {
    id: 'accountability-daily-checkin',
    title: 'Daily Check-In',
    description: 'Complete your daily sobriety check-in. Consistency is key!',
    category: 'accountability',
    rewardAmount: 10000, // $SOBER tokens
    difficulty: 'easy',
    proofType: 'check-in',
    status: 'available',
    completedCount: 15678,
    icon: '/good habits.jpg',
  },
  {
    id: 'accountability-weekly-reflection',
    title: 'Weekly Reflection',
    description: 'Complete your weekly progress review. Celebrate your wins!',
    category: 'accountability',
    rewardAmount: 15000, // $SOBER tokens
    difficulty: 'easy',
    proofType: 'check-in',
    status: 'available',
    completedCount: 4521,
    icon: '/good habits.jpg',
  },
];

// Helper function to get tasks by category
export const getTasksByCategory = (category: Task['category']): Task[] => {
  return TASKS.filter(task => task.category === category);
};

// Helper function to get task by ID
export const getTaskById = (id: string): Task | undefined => {
  return TASKS.find(task => task.id === id);
};

// Category display names and colors
export const CATEGORY_INFO: Record<Task['category'], { label: string; color: string }> = {
  'alcohol-free': { label: 'Alcohol Free', color: 'bg-red-500/20 text-red-400' },
  'smoke-free': { label: 'Smoke Free', color: 'bg-orange-500/20 text-orange-400' },
  'fitness': { label: 'Fitness', color: 'bg-green-500/20 text-green-400' },
  'mindfulness': { label: 'Mindfulness', color: 'bg-purple-500/20 text-purple-400' },
  'community': { label: 'Community', color: 'bg-blue-500/20 text-blue-400' },
  'accountability': { label: 'Accountability', color: 'bg-yellow-500/20 text-yellow-400' },
};

// Difficulty display
export const DIFFICULTY_INFO: Record<Task['difficulty'], { label: string; color: string }> = {
  'easy': { label: 'Easy', color: 'bg-green-500/20 text-green-400' },
  'medium': { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
  'hard': { label: 'Hard', color: 'bg-red-500/20 text-red-400' },
};

// Format $SOBER token amount
export const formatSOL = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
};
