/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'space-black': '#000000',
        'space-gray': {
          900: '#1a1a1a',
          800: '#222222',
          700: '#2d2d2d',
          600: '#373737',
          500: '#4d4d4d',
          400: '#666666',
          300: '#808080',
          200: '#999999',
          100: '#b3b3b3',
          50: '#cccccc'
        },
        'space-blue': {
          DEFAULT: '#005288',
          light: '#00a1e4',
          dark: '#003d66'
        },
        'light': {
          bg: '#ffffff',      // Background color
          card: '#f8fafc',    // Card/container background
          border: '#e2e8f0',  // Border color
          text: {
            primary: '#1e293b',   // Main text color
            secondary: '#64748b'  // Secondary/muted text
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        widest: '0.2em'
      }
    }
  },
  plugins: []
};