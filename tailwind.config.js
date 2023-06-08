/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT');
const colors = require('tailwindcss/colors');

module.exports = withMT({
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-bg': "url('../public/rainbow-vortex.svg')",
      },
      colors: {
        slate: colors.slate,
        segunda: {
          50: '#a4e84c',
          100: '#8bc53f',
          200: '#4bb543',
          300: '#6f9e40',
        },
        primera: {
          50: '#27415e',
          100: '#132b45',
          200: '#152230',
        },
        primary: {
          50: '#8995a2',
          100: '#717f8f',
          200: '#596a7c',
          300: '#42556a',
          400: '#2a4057',
          500: '#132b45',
          600: '#11263e',
          700: '#0f2237',
          800: '#0d1e30',
          900: '#0b1929',
        },
        secondary: {
          50: '#c5e29f',
          100: '#b9dc8b',
          200: '#add678',
          300: '#a2d065',
          400: '#96ca52',
          500: '#8bc53f',
          600: '#7db138',
          700: '#6f9d32',
          800: '#61892c',
          900: '#537625',
        },
      },
      fontFamily: {
        sans: [
          `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
        ],
        serif: [`ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`],
        monospace: [
          `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
        ],
      },
    },
  },
  plugins: [],
});
