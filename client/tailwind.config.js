/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdf0',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#36BA34',
          600: '#2ea12c',
          700: '#237d22',
        },
        background: '#F8FAF8',
      },
      backgroundColor: {
        background: '#F8FAF8',
      },
    },
  },
  plugins: [],
}
