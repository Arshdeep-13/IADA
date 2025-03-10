/** @type {import('tailwindcss').Config} */
export default {

  daisyui: {
    themes: ["light"],
  },

  darkMode: 'class', // or 'media' or 'class'
  preline: {
    theme: 'light',
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('preline/plugin'),require("daisyui"),     require('tailwind-scrollbar'), 
  ]
}