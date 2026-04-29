/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b9fd',
          400: '#8191f8',
          500: '#6268f2',
          600: '#4c49e5',
          700: '#3e3bca',
          800: '#3333a4',
          900: '#0F172A',
          950: '#080d1a',
        },
        gold: {
          50: '#fdf9ee',
          100: '#f9efcd',
          200: '#f3de97',
          300: '#ecc85f',
          400: '#E8B84B',
          500: '#D4A853',
          600: '#B8891F',
          700: '#9a6d19',
          800: '#7d571a',
          900: '#684819',
        },
        slate: {
          DEFAULT: '#64748B',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
      },

      boxShadow: {
        card: '0 4px 24px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 12px 40px rgba(15, 23, 42, 0.16)',
        gold: '0 4px 20px rgba(212, 168, 83, 0.3)',
        'gold-lg': '0 8px 32px rgba(212, 168, 83, 0.4)',
        glow: '0 0 40px rgba(212, 168, 83, 0.15)',
      },

      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A853 0%, #E8B84B 50%, #B8891F 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.7) 100%)',
        shimmer: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },

      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
};
