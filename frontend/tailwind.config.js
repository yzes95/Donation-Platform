/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        warm: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        surface: {
          light: '#FAFAF9',
          card: '#FFFFFF',
          border: '#E7E5E4',
          dark: '#121110',
          darkCard: '#1C1917',
          darkBorder: '#292524',
          darkMuted: '#262220',
        },
        status: {
          pending: '#6B7280',
          review: '#D97706',
          active: '#2563EB',
          verified: '#059669',
          funded: '#0D9488',
          danger: '#DC2626',
          suspended: '#EA580C',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'Plus Jakarta Sans', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(15, 118, 110, 0.1), 0 8px 10px -6px rgba(15, 118, 110, 0.05)',
        'card-dark': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'card-dark-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'card': '1rem',
        'badge': '9999px',
        'button': '0.75rem',
      }
    },
  },
  plugins: [],
}
