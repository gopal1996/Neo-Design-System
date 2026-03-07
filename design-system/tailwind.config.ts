import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
  theme: {
    // ── Override defaults ──────────────────────────────────────
    fontFamily: {
      sans: ["'Inter'", "'SF Pro Display'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      mono: ["'JetBrains Mono'", "'Fira Code'", 'monospace'],
    },
    extend: {
      // ── Colors ────────────────────────────────────────────────
      colors: {
        // Backgrounds / surfaces
        surface: {
          base:     '#000000',
          subtle:   '#08080F',
          elevated: '#0F0F1A',
          overlay:  '#13131F',
          muted:    '#1A1A2E',
        },
        // Brand violet (replaces Tailwind's default)
        violet: {
          50:  '#EDE9FE',
          100: '#DDD6FE',
          200: '#C4B5FD',
          300: '#A78BFA',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#2E0D6E',
          950: '#1A0640',
        },
        // Purple-tinted neutrals
        neutral: {
          50:  '#F0F0F8',
          100: '#E2E2EE',
          200: '#C5C5D8',
          300: '#9898B3',
          400: '#6B6B8A',
          500: '#55556E',
          600: '#3D3D5C',
          700: '#2C2C4A',
          800: '#1E1E35',
          900: '#16162A',
        },
        // Semantic
        success: { DEFAULT: '#10B981', light: '#34D399', bg: '#0A2A1F' },
        warning: { DEFAULT: '#F59E0B', light: '#FCD34D', bg: '#2A1F06' },
        error:   { DEFAULT: '#EF4444', light: '#F87171', bg: '#2A0A0A' },
        info:    { DEFAULT: '#06B6D4', light: '#22D3EE', bg: '#041F26' },
        // Content (text)
        content: {
          primary:   '#F0F0F8',
          secondary: '#9898B3',
          tertiary:  '#6B6B8A',
          disabled:  '#3D3D5C',
          brand:     '#A78BFA',
        },
        // Stroke (borders)
        stroke: {
          DEFAULT: '#2C2C4A',
          subtle:  '#1E1E35',
          strong:  '#3D3D5C',
          brand:   '#6D28D9',
          focus:   '#8B5CF6',
        },
      },

      // ── Font sizes ────────────────────────────────────────────
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.025em' }],
      },

      // ── Shadows ───────────────────────────────────────────────
      boxShadow: {
        'glow-sm':    '0 0 12px 0 rgba(124,58,237,0.4)',
        'glow-md':    '0 0 20px 0 rgba(124,58,237,0.5)',
        'glow-lg':    '0 0 40px 0 rgba(124,58,237,0.6)',
        'card':       '0 1px 0 0 rgba(44,44,74,0.8), 0 4px 12px 0 rgba(0,0,0,0.5)',
        'card-hover': '0 1px 0 0 rgba(109,40,217,0.5), 0 8px 24px 0 rgba(0,0,0,0.6), 0 0 0 1px rgba(109,40,217,0.2)',
        'focus-ring': '0 0 0 3px rgba(139,92,246,0.35)',
        'focus-ring-error': '0 0 0 3px rgba(239,68,68,0.25)',
        'inner':      'inset 0 2px 4px 0 rgba(0,0,0,0.5)',
      },

      // ── Background images ─────────────────────────────────────
      backgroundImage: {
        'shimmer':        'linear-gradient(90deg, #1E1E35 25%, #2C2C4A 50%, #1E1E35 75%)',
        'gradient-brand': 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(139,92,246,0.05) 100%)',
        'gradient-surface': 'linear-gradient(180deg, #0F0F1A 0%, #08080F 100%)',
        'btn-primary':    'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
        'btn-primary-hover': 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
        'gradient-violet-text': 'linear-gradient(135deg, #A78BFA 0%, #DDD6FE 100%)',
      },

      // ── Animations & keyframes ────────────────────────────────
      animation: {
        'fade-in':        'fade-in 200ms ease forwards',
        'fade-up':        'fade-up 300ms ease forwards',
        'scale-in':       'scale-in 200ms ease forwards',
        'dp-in':          'dp-in 150ms ease forwards',
        'tooltip-in':     'tooltip-in 120ms ease forwards',
        'tooltip-in-x':   'tooltip-in-x 120ms ease forwards',
        'bounce-dot':     'bounce-dot 1.2s ease-in-out infinite',
        'pulse-circle':   'pulse-circle 1.5s ease-in-out infinite',
        'shimmer-sweep':  'shimmer-sweep 1.6s ease-in-out infinite',
        'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
        'glow-pulse':     'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in':      { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up':      { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in':     { from: { opacity: '0', transform: 'scale(0.95)' },     to: { opacity: '1', transform: 'scale(1)' } },
        'dp-in':        { from: { opacity: '0', transform: 'translateY(-6px) scale(0.98)' }, to: { opacity: '1', transform: 'none' } },
        'tooltip-in':   { from: { opacity: '0', transform: 'translateX(-50%) scale(0.96)' }, to: { opacity: '1', transform: 'translateX(-50%) scale(1)' } },
        'tooltip-in-x': { from: { opacity: '0', transform: 'translateY(-50%) scale(0.96)' }, to: { opacity: '1', transform: 'translateY(-50%) scale(1)' } },
        'bounce-dot': {
          '0%,100%': { transform: 'translateY(0)',     opacity: '0.5' },
          '50%':     { transform: 'translateY(-40%)',  opacity: '1' },
        },
        'pulse-circle': {
          '0%,100%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%':     { transform: 'scale(1)',   opacity: '1' },
        },
        'shimmer-sweep': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'skeleton-pulse': {
          '0%,100%': { opacity: '0.4' },
          '50%':     { opacity: '0.8' },
        },
        'glow-pulse': {
          '0%,100%': { boxShadow: '0 0 12px 0 rgba(124,58,237,0.3)' },
          '50%':     { boxShadow: '0 0 24px 0 rgba(124,58,237,0.6)' },
        },
      },

      // ── Transitions ───────────────────────────────────────────
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },

      // ── Background size ───────────────────────────────────────
      backgroundSize: {
        'shimmer': '200% 100%',
      },
    },
  },
  plugins: [],
};

export default config;
