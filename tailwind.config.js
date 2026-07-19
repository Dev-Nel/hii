/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kawaii: {
          pink: '#ffc8d6',
          pinkDeep: '#ff9ec0',
          pinkDark: '#e06d96',
          cream: '#fff6ec',
          blue: '#c5e3ff',
          blueDeep: '#9cc8f0',
          lavender: '#e0d4ff',
          lavenderDeep: '#b9a4e8',
          mint: '#c8f0e0',
          mintDeep: '#8fdcc0',
          brown: '#8a5a44',
          ink: '#6a4a5a',
          white: '#ffffff',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        silk: ['"Silkscreen"', 'monospace'],
      },
      boxShadow: {
        pixel: '0 4px 0 #b58aa0',
        soft: '0 6px 20px rgba(224,109,150,0.18)',
      },
      borderRadius: {
        pixel: '14px',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
