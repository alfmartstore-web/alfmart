/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./admin.html",
    "./products.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
        leather: 'var(--color-leather)',
        whiskey: 'var(--color-whiskey)',
        gold: 'var(--color-gold)',
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', '"Crimson Text"', 'serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}