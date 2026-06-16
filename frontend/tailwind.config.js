/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A0F1C',
          800: '#111827',
          700: '#1F2937',
        },
        cyan: {
          500: '#00F0FF',
          400: '#22d3ee',
        },
        purple: {
          500: '#B026FF',
          400: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
