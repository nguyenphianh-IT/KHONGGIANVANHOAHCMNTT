/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          red: {
            50: '#FDF2F2',
            100: '#FCE6E6',
            200: '#F7C4C5',
            300: '#EE9698',
            400: '#DD5F63',
            500: '#C72F35',
            600: '#A82229',
            700: '#8B151B', // Primary deep red
            800: '#730E14',
            900: '#5C0A0E',
            950: '#380407',
          },
          gold: {
            50: '#FAF8EF',
            100: '#F4EFD5',
            200: '#E9DEAA',
            300: '#DCC77B',
            400: '#D4AF37', // Imperial gold
            500: '#B89025',
            600: '#946F1A',
            700: '#735216',
            800: '#5A3F16',
            900: '#473216',
          },
          ivory: {
            50: '#FFFFFF',
            100: '#FDFBF7', // Main soft ivory background
            200: '#F6F2EA',
            300: '#ECE5D8',
            400: '#DDD2BF',
          },
          ink: {
            50: '#F3F4F6',
            100: '#E5E7EB',
            500: '#6B7280',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
            950: '#0B0F17',
          }
        }
      },
      fontFamily: {
        serif: ['"Merriweather"', '"Noto Serif"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'heritage': '0 4px 20px -2px rgba(139, 21, 27, 0.08), 0 2px 6px -1px rgba(139, 21, 27, 0.04)',
        'heritage-hover': '0 10px 25px -3px rgba(139, 21, 27, 0.15), 0 4px 8px -2px rgba(139, 21, 27, 0.06)',
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.35)',
      }
    },
  },
  plugins: [],
}
