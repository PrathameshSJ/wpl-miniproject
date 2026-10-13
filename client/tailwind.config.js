/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B05E2D',
          hover: '#944D23',
          dark: '#6B3A2A',
          light: '#F8EDE3',
          container: '#F5D6B8',
        },
        accent: {
          DEFAULT: '#F4A261',
          hover: '#E76F51',
          light: '#FCEFE6',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          warm: '#FDF8F3',
          card: '#FBF5ED',
          border: '#EADBC8',
        },
        ink: {
          DEFAULT: '#2C1810',
          muted: '#7A665A',
          light: '#A39084',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
