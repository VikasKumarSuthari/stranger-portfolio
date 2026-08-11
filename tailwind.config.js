/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stranger: {
          red: '#E71D36',
          blue: '#3A86FF',
          dark: '#0a0a0a',
          'dark-overlay': 'rgba(10, 10, 10, 0.85)',
          purple: '#9B59B6',
          'spore-blue': '#96C8FF',
          'interference-green': '#00FF41',
        }
      },
      fontFamily: {
        custom: ['"ITC Benguiat"', 'serif'],
        mono: ['"Courier Prime"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
        'blink': 'blink 0.8s step-end infinite',
        'glitch': 'glitch-skew 0.3s ease',
      },
      keyframes: {
        flicker: {
          '0%': { opacity: '0.9' },
          '5%': { opacity: '0.2' },
          '10%': { opacity: '0.9' },
          '15%': { opacity: '0.1' },
          '100%': { opacity: '0.9' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      }
    },
  },
  plugins: [],
}
