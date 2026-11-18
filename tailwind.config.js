/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1', // Indigo 500
          accent: '#10B981',  // Emerald 500
          dark: '#4F46E5',    // Indigo 600
        },
        surface: {
          card: '#FFFFFF',
          cardDark: '#151C2C',
          subtle: '#F1F5F9',
          subtleDark: '#1E293B',
        },
        bg: {
          appLight: '#F8FAFC',
          appDark: '#0B0F19',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 4px 20px -2px rgba(99, 102, 241, 0.25)',
        'glow-accent': '0 4px 20px -2px rgba(16, 185, 129, 0.25)',
        'card-soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      }
    },
  },
  plugins: [],
}
