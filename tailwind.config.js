/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0b5c93', dark: '#08476f', soft: '#e7f0f8' },
        ink: { DEFAULT: '#0f1f33', muted: '#5b6b7d', faint: '#8a97a6' },
        canvas: '#f5f8fc',
        line: '#e2e8f0',
        mortel: { DEFAULT: '#c0141c', soft: '#fde9ea' },
        grave: { DEFAULT: '#b45309', soft: '#fef5dc', bar: '#f59e0b' },
        leger: { DEFAULT: '#1d6fb8', soft: '#e3effa' },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 31 51 / 0.04), 0 1px 3px rgb(15 31 51 / 0.06)',
      },
    },
  },
  plugins: [],
};