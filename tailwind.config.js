/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Manrope"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          900: '#0b1220',
          800: '#1f2937',
          700: '#334155',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#eef2f7',
          50: '#f4f6fb',
        },
      },
      boxShadow: {
        soft: '0 1px 0 rgba(15,23,42,.04), 0 1px 2px rgba(15,23,42,.05)',
        lift: '0 2px 0 rgba(15,23,42,.03), 0 12px 28px -16px rgba(15,23,42,.18), 0 4px 12px -6px rgba(15,23,42,.08)',
        glow: '0 1px 0 rgba(255,255,255,.6) inset, 0 12px 32px -14px rgba(2,6,23,.18), 0 6px 16px -10px rgba(2,6,23,.10)',
        rail: 'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 1px rgba(15,23,42,.04)',
      },
      transitionTimingFunction: {
        glide: 'cubic-bezier(0.32, 0.72, 0, 1)',
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
