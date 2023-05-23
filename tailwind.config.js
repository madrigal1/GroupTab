/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        'custom-md': '0.9rem',
      },
    },
    maxWidth: {
      sm: '0.9rem',
    },
  },
  plugins: [],
}
