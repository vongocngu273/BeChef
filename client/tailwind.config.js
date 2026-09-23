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
          50: 'var(--color-primary-light)',
          100: 'var(--color-primary-light)',
          200: 'var(--color-primary-border)',
          300: 'var(--color-primary-border)',
          400: 'var(--color-primary)',
          500: 'var(--color-primary)',
          600: 'var(--color-primary-hover)',
          700: 'var(--color-primary-hover)',
        },
        theme: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-light': 'var(--color-primary-light)',
          'primary-border': 'var(--color-primary-border)',
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
