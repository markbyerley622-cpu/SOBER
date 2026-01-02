'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Card, Badge, Button, SolanaLogo } from '../ui';
import { useApp } from '@/context/AppContext';
import { Task, TaskCategory } from '@/types';
import { CATEGORY_INFO, DIFFICULTY_INFO, formatSOL } from '@/data/tasks';

const categories: { key: TaskCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Tasks' },
  { key: 'alcohol-free', label: 'Alcohol Free' },
  { key: 'smoke-free', label: 'Smoke Free' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'mindfulness', label: 'Mindfulness' },
  { key: 'community', label: 'Community' },
  { key: 'accountability', label: 'Accountability' },
];

interface TaskCardProps {
  task: Task;
  onStart: (task: Task) => void;
  isConnected: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStart, isConnected }) => {
  const categoryInfo = CATEGORY_INFO[task.category];
  const difficultyInfo = DIFFICULTY_INFO[task.difficulty];

  return (
    <Card variant="default" hover className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sober-blue-dark to-sober-blue-darker flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image
            src={task.icon}
            alt={task.title}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{task.title}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="default" size="sm" className={categoryInfo.color}>
              {categoryInfo.label}
            </Badge>
            <Badge variant="default" size="sm" className={difficultyInfo.color}>
              {difficultyInfo.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm flex-1 mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between py-3 border-t border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <SolanaLogo size={24} />
          <span className="gradient-solana font-bold text-lg">+{formatSOL(task.rewardAmount)}</span>
          <span className="text-gray-400 text-sm">SOL</span>
        </div>
        <div className="text-gray-500 text-sm">
          {task.completedCount.toLocaleString()} completed
        </div>
      </div>

      {/* Action Button */}
      {task.status === 'locked' ? (
        <Button variant="ghost" disabled className="w-full opacity-50">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Locked
        </Button>
      ) : isConnected ? (
        <Button variant="primary" className="w-full" onClick={() => onStart(task)}>
          Start Task
        </Button>
      ) : (
        <Button variant="secondary" className="w-full" onClick={() => onStart(task)}>
          Connect to Start
        </Button>
      )}
    </Card>
  );
};

const TasksSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all');
  const { tasks, setSelectedTask, setIsProofModalOpen } = useApp();
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const filteredTasks = activeCategory === 'all'
    ? tasks
    : tasks.filter(task => task.category === activeCategory);

  const handleStartTask = (task: Task) => {
    if (!connected) {
      setVisible(true);
      return;
    }
    setSelectedTask(task);
    setIsProofModalOpen(true);
  };

  return (
    <section id="tasks" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Tasks & <span className="gradient-solana">Rewards</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose from a variety of sobriety-focused tasks. Complete them to earn SOL
            directly to your wallet. All rewards are distributed on Solana.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-r from-[#14F195] to-[#9945FF] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStart={handleStartTask}
              isConnected={connected}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No tasks available in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TasksSection;
