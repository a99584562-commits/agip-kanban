/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Manrope"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#0f172a',
          700: '#334155',
          500: '#64748b',
          300: '#cbd5e1',
          100: '#f1f5f9',
        },
        accent: {
          DEFAULT: '#1e3a8a',
          soft: '#eef2ff',
          line: '#dbe1ff',
        },
      },
    },
  },
  plugins: [],
}
