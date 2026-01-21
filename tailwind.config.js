/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#050510',
        glass: 'rgba(255, 255, 255, 0.05)',
        primary: {
          DEFAULT: '#00f3ff',
          dim: 'rgba(0, 243, 255, 0.1)',
        },
        accent: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
