'use client';

import React from 'react';
import Image from 'next/image';
import { Card, Button } from '../ui';

const Community: React.FC = () => {
  return (
    <section id="community" className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sober-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sober-green/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Join the{' '}
              <span className="gradient-text">SOBER Community</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              You're not alone on this journey. Connect with thousands of others who are
              committed to living their best sober life. Share wins, get support, and
              celebrate milestones together.
            </p>

            {/* Community Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-sober-blue/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-sober-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">24/7 Support Chat</h4>
                  <p className="text-gray-400 text-sm">
                    Active community members ready to help at any time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-sober-green/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-sober-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Milestone Celebrations</h4>
                  <p className="text-gray-400 text-sm">
                    Community recognition for your achievements
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-sober-gold/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-sober-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Accountability Partners</h4>
                  <p className="text-gray-400 text-sm">
                    Connect with others for mutual support and motivation
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                }
              >
                Join Discord
              </Button>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                }
              >
                Follow on X
              </Button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Community Background Image */}
              <div className="absolute inset-0 -m-8 rounded-3xl overflow-hidden">
                <Image
                  src="/community.jpg"
                  alt="SOBER Community Background"
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sober-blue-darker via-transparent to-sober-blue-darker/50" />
              </div>

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#14F195]/20 via-[#9945FF]/20 to-sober-gold/20 rounded-full blur-3xl scale-90" />

              <Image
                src="/photo_2026-01-02_23-47-12-removebg-preview.png"
                alt="SOBER Mascot - Fitness Giraffe"
                width={420}
                height={420}
                className="relative z-10 animate-float drop-shadow-[0_0_30px_rgba(20,241,149,0.3)]"
              />

              {/* Floating elements */}
              <div className="absolute top-5 left-0 bg-sober-blue-darker/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#14F195]/30 shadow-lg animate-bounce">
                <span className="text-sober-green">✓</span>
                <span className="text-gray-300 text-sm ml-2">12.8K members</span>
              </div>

              <div className="absolute bottom-10 right-0 bg-sober-blue-darker/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#9945FF]/30 shadow-lg animate-bounce delay-150">
                <span className="text-lg">💪</span>
                <span className="text-gray-300 text-sm ml-2">Stronger together</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <Card variant="gradient" className="mt-20">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              Connect your wallet, complete your first task, and earn your first $SOBER rewards.
              Every step counts on the path to wellness.
            </p>
            <Button variant="gold" size="lg">
              Get Started Now
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Community;
