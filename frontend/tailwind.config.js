/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          500: '#10b981',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
};
