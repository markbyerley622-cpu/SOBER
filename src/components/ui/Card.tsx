'use client';

import React, { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      hover = false,
      padding = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const variants = {
      default:
        'bg-sober-blue-darker/50 backdrop-blur-sm border border-white/10',
      glass:
        'bg-white/5 backdrop-blur-md border border-white/10',
      gradient:
        'bg-gradient-to-br from-sober-blue-darker/80 to-sober-blue-dark/50 border border-sober-blue/20',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hover
      ? 'hover:border-sober-blue/30 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-sober-blue/10 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`rounded-2xl transition-all duration-300 ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
