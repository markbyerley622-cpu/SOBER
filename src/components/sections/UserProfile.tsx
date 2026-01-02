'use client';

import React from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, Badge, SolanaLogo } from '../ui';
import { useApp } from '@/context/AppContext';
import { shortenAddress } from '@/data/mock';
import { formatSOL, CATEGORY_INFO } from '@/data/tasks';

const UserProfile: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { userTasks, tasks, userStats } = useApp();

  if (!connected || !publicKey) return null;

  const walletAddress = publicKey.toString();

  // Get user's tasks by status
  const pendingTasks = userTasks.filter(ut => ut.status === 'pending_review');
  const completedTasks = userTasks.filter(ut => ut.status === 'completed');
  const inProgressTasks = userTasks.filter(ut => ut.status === 'in_progress');

  // Get task details for user tasks
  const getTaskDetails = (taskId: string) => tasks.find(t => t.id === taskId);

  return (
    <section id="profile" className="py-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card variant="gradient" className="mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF] flex items-center justify-center">
              <Image
                src="/Screenshot_2026-01-01_230537-removebg-preview.png"
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">Your Profile</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="w-2 h-2 bg-sober-green rounded-full"></div>
                <span className="text-gray-400 font-mono text-sm">
                  {shortenAddress(walletAddress)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {userStats?.tasksCompleted || 0}
                </div>
                <div className="text-gray-400 text-xs">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sober-orange">
                  {pendingTasks.length}
                </div>
                <div className="text-gray-400 text-xs">Pending</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <SolanaLogo size={20} />
                  <span className="text-2xl font-bold gradient-solana">
                    {formatSOL(userStats?.totalRewardsEarned || 0)}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">Earned</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-sober-orange rounded-full animate-pulse"></div>
              Pending Verification ({pendingTasks.length})
            </h3>
            <div className="space-y-3">
              {pendingTasks.map(ut => {
                const task = getTaskDetails(ut.taskId);
                if (!task) return null;
                const categoryInfo = CATEGORY_INFO[task.category];

                return (
                  <Card key={ut.taskId} variant="glass" padding="sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sober-blue-dark flex items-center justify-center flex-shrink-0">
                        <Image
                          src={task.icon}
                          alt={task.title}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default" size="sm" className={categoryInfo.color}>
                            {categoryInfo.label}
                          </Badge>
                          <Badge variant="warning" size="sm">
                            Pending Review
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <SolanaLogo size={16} />
                          <span className="gradient-solana font-bold">+{formatSOL(task.rewardAmount)}</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {ut.submittedAt ? new Date(ut.submittedAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* In Progress Tasks */}
        {inProgressTasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-sober-blue rounded-full animate-pulse"></div>
              In Progress ({inProgressTasks.length})
            </h3>
            <div className="space-y-3">
              {inProgressTasks.map(ut => {
                const task = getTaskDetails(ut.taskId);
                if (!task) return null;
                const categoryInfo = CATEGORY_INFO[task.category];

                return (
                  <Card key={ut.taskId} variant="glass" padding="sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sober-blue-dark flex items-center justify-center flex-shrink-0">
                        <Image
                          src={task.icon}
                          alt={task.title}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default" size="sm" className={categoryInfo.color}>
                            {categoryInfo.label}
                          </Badge>
                          <Badge variant="info" size="sm">
                            In Progress
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <SolanaLogo size={16} />
                          <span className="gradient-solana font-bold">+{formatSOL(task.rewardAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-sober-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-3">
              {completedTasks.map(ut => {
                const task = getTaskDetails(ut.taskId);
                if (!task) return null;
                const categoryInfo = CATEGORY_INFO[task.category];

                return (
                  <Card key={ut.taskId} variant="glass" padding="sm" className="opacity-80">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sober-green/20 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={task.icon}
                          alt={task.title}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default" size="sm" className={categoryInfo.color}>
                            {categoryInfo.label}
                          </Badge>
                          <Badge variant="success" size="sm">
                            Verified
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <SolanaLogo size={16} />
                          <span className="text-sober-green font-bold">+{formatSOL(task.rewardAmount)}</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {ut.completedAt ? new Date(ut.completedAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {userTasks.length === 0 && (
          <Card variant="glass" className="text-center py-12">
            <Image
              src="/meditate_-removebg-preview.png"
              alt="No tasks"
              width={100}
              height={100}
              className="mx-auto mb-4 opacity-50"
            />
            <h3 className="text-xl font-semibold text-white mb-2">No Tasks Yet</h3>
            <p className="text-gray-400 mb-4">
              Start your sobriety journey by completing your first task!
            </p>
            <button
              onClick={() => document.getElementById('tasks')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sober-blue hover:text-sober-blue-light transition-colors font-medium"
            >
              Browse Tasks →
            </button>
          </Card>
        )}
      </div>
    </section>
  );
};

export default UserProfile;
