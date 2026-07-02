/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18212f',
        reef: '#0f766e',
        coral: '#ef6f5e',
        mist: '#f4f7fb'
      }
    }
  },
  plugins: []
};
