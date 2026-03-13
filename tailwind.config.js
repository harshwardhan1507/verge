/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        accent: '#7c6af7',
        'accent-secondary': '#4f9ef5',
        'text-primary': '#f0f0f5',
        'text-muted': '#6b6b80',
        commitment: '#f59e0b',
        person: '#0ea5e9',
        emotion: '#f43f5e',
        pattern: '#a855f7',
        event: '#22c55e',
        unresolved: '#f97316',
        insight: '#14b8a6',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
