/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT');

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
      },
    },
  },
  plugins: [],
});
