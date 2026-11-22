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
        ink: {
          950: '#06070B',
          900: '#090A0F',
          850: '#0D0E15',
          800: '#12141D',
          700: '#181B26',
          600: '#1F2333',
          500: '#2A3044',
          400: '#3D4560',
        },
        charcoal: {
          surface: '#12141D',
          card: '#161925',
          elevated: '#1D2130',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-subtle': 'rgba(255, 255, 255, 0.04)',
          'border-highlight': 'rgba(255, 255, 255, 0.14)',
        },
        glow: {
          violet: '#A855F7',
          teal: '#14B8A6',
          mint: '#10B981',
          amber: '#F59E0B',
          coral: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(168, 85, 247, 0.25)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.25)',
        'glow-mint': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glow-coral': '0 0 25px -5px rgba(244, 63, 94, 0.25)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'night-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(120, 80, 220, 0.08) 0%, transparent 70%)',
        'teal-haze': 'radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.06) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
