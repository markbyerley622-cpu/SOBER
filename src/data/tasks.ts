import { Task } from '@/types';

// Pre-defined sobriety tasks
// Rewards are in SOL (Solana), ranging from 0.01 to 0.05 SOL per task
export const TASKS: Task[] = [
  // Alcohol-Free Tasks
  {
    id: 'alcohol-clear-space',
    title: 'Environment Reset',
    description: 'Clear your living space of alcohol. Upload a photo showing your alcohol-free environment.',
    category: 'alcohol-free',
    rewardAmount: 0.03, // SOL
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
    rewardAmount: 0.05, // SOL
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
    rewardAmount: 0.1, // SOL - bonus for major milestone
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
    rewardAmount: 0.03, // SOL
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
    rewardAmount: 0.05, // SOL
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
    rewardAmount: 0.02, // SOL
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
    rewardAmount: 0.04, // SOL
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
    rewardAmount: 0.015, // SOL
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
    rewardAmount: 0.02, // SOL
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
    rewardAmount: 0.05, // SOL
    difficulty: 'medium',
    proofType: 'referral',
    status: 'available',
    completedCount: 567,
    icon: '/good winning.jpg',
  },
  {
    id: 'community-share-story',
    title: 'Share Your Story',
    description: 'Share your sobriety journey on social media (Twitter/X). Inspire others!',
    category: 'community',
    rewardAmount: 0.03, // SOL
    difficulty: 'easy',
    proofType: 'image',
    status: 'available',
    completedCount: 789,
    icon: '/good winning.jpg',
  },

  // Accountability Tasks
  {
    id: 'accountability-daily-checkin',
    title: 'Daily Check-In',
    description: 'Complete your daily sobriety check-in. Consistency is key!',
    category: 'accountability',
    rewardAmount: 0.01, // SOL
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
    rewardAmount: 0.015, // SOL
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

// Format SOL amount
export const formatSOL = (amount: number): string => {
  return amount.toFixed(amount < 0.01 ? 3 : 2);
};
