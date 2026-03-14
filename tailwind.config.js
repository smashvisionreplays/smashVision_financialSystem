/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sv: {
          black: '#0F0F0F',
          dark: '#1A1A1A',
          gray: '#2A2A2A',
          'gray-light': '#3A3A3A',
          'gray-text': '#9CA3AF',
          lime: '#AAFF00',
          'lime-dark': '#88CC00',
          'lime-glow': 'rgba(170, 255, 0, 0.15)',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
