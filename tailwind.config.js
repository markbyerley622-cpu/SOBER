/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Safari/Giraffe Theme Colors
        giraffe: {
          yellow: '#F4C430',
          light: '#F7D35C',
          dark: '#C9A228',
        },
        savanna: {
          cream: '#EFE6D1',
          light: '#F5F0E5',
          dark: '#D4C9B5',
        },
        pattern: {
          tan: '#D6B37A',
          light: '#E2C696',
          dark: '#B89A5F',
        },
        outline: {
          black: '#0B0B0B',
          dark: '#1A1A1A',
          medium: '#2A2A2A',
        },
        // Legacy mappings for compatibility
        sober: {
          blue: {
            light: '#F4C430',
            DEFAULT: '#F4C430',
            dark: '#1A1A1A',
            darker: '#0B0B0B',
          },
          green: {
            light: '#F4C430',
            DEFAULT: '#F4C430',
            dark: '#D6B37A',
          },
          orange: {
            light: '#D6B37A',
            DEFAULT: '#D6B37A',
            dark: '#B89A5F',
          },
          gold: {
            light: '#F7D35C',
            DEFAULT: '#F4C430',
            dark: '#C9A228',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Baloo 2"', '"Luckiest Guy"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
