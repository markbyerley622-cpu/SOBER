'use client';

import React from 'react';
import Image from 'next/image';

interface ComicPanel {
  src: string;
  caption: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}

const comicPanels: ComicPanel[] = [
  {
    src: '/photo_2026-01-05_02-27-16.jpg',
    caption: 'Start Your Journey',
    size: 'medium',
  },
  {
    src: '/photo_2026-01-05_02-27-24.jpg',
    caption: 'Share Your Story',
    size: 'medium',
  },
  {
    src: '/photo_2026-01-05_02-27-34.jpg',
    caption: 'Join The Community',
    size: 'large',
  },
  {
    src: '/photo_2026-01-05_02-27-39.jpg',
    caption: 'Learn & Grow',
    size: 'medium',
  },
  {
    src: '/photo_2026-01-05_02-27-43.jpg',
    caption: 'Find Inner Peace',
    size: 'tall',
  },
  {
    src: '/photo_2026-01-05_02-28-17.jpg',
    caption: 'Stay Strong Socially',
    size: 'medium',
  },
  {
    src: '/photo_2026-01-05_02-27-47.jpg',
    caption: 'Day 7 Streak!',
    size: 'wide',
  },
  {
    src: '/photo_2026-01-05_02-27-53.jpg',
    caption: 'Build Your Strength',
    size: 'medium',
  },
  {
    src: '/photo_2026-01-05_02-28-35.jpg',
    caption: 'Breathe Fresh Air',
    size: 'medium',
  },
  {
    src: '/photo_2026-01-05_02-28-07.jpg',
    caption: 'Live Your Best Life',
    size: 'wide',
  },
  {
    src: '/photo_2026-01-05_02-27-57.jpg',
    caption: 'Freedom Awaits',
    size: 'large',
  },
  {
    src: '/photo_2026-01-05_02-28-13.jpg',
    caption: '30 Days Champion!',
    size: 'tall',
  },
];

const ComicGallery: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="gallery">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-sober-blue-darker via-black/50 to-sober-blue-darker" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#9945FF]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-sober-blue/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">The </span>
            <span className="gradient-text">SOBER</span>
            <span className="text-white"> Journey</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow our mascot through the transformation of living sober and earning rewards
          </p>
        </div>

        {/* Comic Grid */}
        <div className="comic-grid">
          {comicPanels.map((panel, index) => (
            <div
              key={index}
              className={`comic-panel comic-panel-${panel.size} group`}
            >
              {/* Comic panel border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Panel number */}
              <div className="absolute top-2 left-2 z-20 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20">
                <span className="text-xs font-bold text-white">{index + 1}</span>
              </div>

              {/* Image container */}
              <div className="relative w-full h-full overflow-hidden rounded-lg border-4 border-white/20 group-hover:border-sober-blue/50 transition-colors duration-300">
                <Image
                  src={panel.src}
                  alt={panel.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                  <div className="comic-caption">
                    <span className="text-white font-bold text-sm sm:text-base uppercase tracking-wide">
                      {panel.caption}
                    </span>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-sober-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Ready to start your own journey?</p>
          <button
            onClick={() => document.getElementById('tasks')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary px-8 py-3 font-semibold"
          >
            Begin Your Story
          </button>
        </div>
      </div>

      <style jsx>{`
        .comic-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          grid-auto-rows: 200px;
        }

        @media (min-width: 768px) {
          .comic-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            grid-auto-rows: 220px;
          }
        }

        @media (min-width: 1024px) {
          .comic-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            grid-auto-rows: 250px;
          }
        }

        .comic-panel {
          position: relative;
          border-radius: 12px;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2),
            inset 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .comic-panel-small {
          grid-column: span 1;
          grid-row: span 1;
        }

        .comic-panel-medium {
          grid-column: span 1;
          grid-row: span 1;
        }

        .comic-panel-large {
          grid-column: span 2;
          grid-row: span 1;
        }

        .comic-panel-wide {
          grid-column: span 2;
          grid-row: span 1;
        }

        .comic-panel-tall {
          grid-column: span 1;
          grid-row: span 2;
        }

        @media (max-width: 767px) {
          .comic-panel-large,
          .comic-panel-wide {
            grid-column: span 2;
          }
          .comic-panel-tall {
            grid-column: span 1;
            grid-row: span 2;
          }
        }

        .comic-caption {
          position: relative;
          display: inline-block;
          padding: 4px 12px;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(153, 69, 255, 0.3));
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default ComicGallery;
