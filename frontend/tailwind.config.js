/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#A52A2A', // Brown color in hex
        'custom-white': '#FFFFFF', // White color in hex
        'custom-black': '#000000', // Black color in hex
        'custom-grey': '#686D76',
        'custom-hover': '#C7C8CC',
        'custom-hover-faint': 'rgba(128, 128, 128, 0.211)',
        'custom-backdrop': '#2C3333',
        'custom-green': '#7F9F80',
        'custom-dark-blue': '#131921',
        'custom-blue': '#1679AB',
        'custom-yellow': '#EEEBDD',
        'custom-white-yellow': '#FEFAF6',
      },
      height: {
        'main-nav': '3rem',
        'sub-main-nav': '2rem',
        'nav-overall': 'calc(3rem + 2rem + 2.5rem)',
        'footer': '5.5rem',
      },
      padding: {
        'page': '10vw',
        'button': '.25rem .5rem',
      },
      gap: {
        'main-nav': '2rem',
        'more': '1.5rem',
        'default': '.5rem',
        'faint': '0.2rem',
      },
      fontSize: {
        'main-header': '1.5rem',
        'header': '1.25rem',
        'nav': '1rem',
        'default': '1.15rem',
        'min': '.8rem',
      },
      borderRadius: {
        'more': '1.5rem',
      },
    },
  },
  plugins: [],
}
