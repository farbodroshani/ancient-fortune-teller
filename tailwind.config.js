/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'noto-serif-sc': ['"Noto Serif SC"', 'serif'],
      },
    },
  },
  plugins: [],
};