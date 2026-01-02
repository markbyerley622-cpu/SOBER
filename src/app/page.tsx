'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Hero,
  HowItWorks,
  TasksSection,
  Leaderboard,
  LiveFeed,
  Community,
  ProofUploadModal,
  UserProfile,
} from '@/components/sections';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />

        {/* How It Works */}
        <HowItWorks />

        {/* Live Activity Feed */}
        <LiveFeed />

        {/* User Profile (shows when connected) */}
        <UserProfile />

        {/* Tasks & Rewards */}
        <TasksSection />

        {/* Leaderboard */}
        <Leaderboard />

        {/* Community */}
        <Community />
      </main>
      <Footer />

      {/* Proof Upload Modal */}
      <ProofUploadModal />
    </>
  );
}
