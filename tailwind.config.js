/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#ede0ff',
          200: '#dec5ff',
          300: '#c99eff',
          400: '#b275ff',
          500: '#9d4eff',
          600: '#8a2be2', // Primary color
          700: '#7922c9',
          800: '#651ea8',
          900: '#531c85',
          950: '#35115a',
        },
        secondary: {
          50: '#f0fdff',
          100: '#ccfaff',
          200: '#99f5fe',
          300: '#5aedfd',
          400: '#27daf5',
          500: '#00ced1', // Secondary color
          600: '#0aa2b6',
          700: '#117f94',
          800: '#15657a',
          900: '#174f68',
          950: '#0c3548',
        },
        accent: {
          50: '#fff8f0',
          100: '#ffefd8',
          200: '#ffdcb2',
          300: '#ffc380',
          400: '#ff9f4d',
          500: '#ff7825',
          600: '#ff5d0b',
          700: '#e74207',
          800: '#be320c',
          900: '#9b2a0e',
          950: '#531106',
        }
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        marquee: 'marquee 15s linear infinite'
      }
    },
  },
  plugins: [],
};