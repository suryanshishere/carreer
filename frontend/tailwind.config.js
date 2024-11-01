/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#A52A2A',
        'custom-less-red': '#F5004F',
        'custom-white': '#FFFFFF', 
        'custom-black': '#000000', 
        'custom-grey': '#686D76',
        'custom-less-grey': '#C7C8CC',
        'custom-hover-faint': 'rgba(128, 128, 128, 0.211)',
        'custom-backdrop': '#2C3333',
        'custom-green': '#7F9F80',
        'custom-dark-blue': '#131921',
        'custom-blue': '#1679AB',
        'custom-yellow': '#EEEBDD',
        'custom-white-yellow': '#FEFAF6',
      },
      spacing: {
        'main-nav': '3rem',
        'auth-nav':'5rem',
        'sub-nav': '2rem',
        'auth-sub-nav': '7rem',
        'nav-overall': '8rem',
        'footer': '5.5rem',
      },
      padding: {
        'page': '10vw',
        'button': '.25rem .5rem',
      },
      gap: {
      },
      fontSize: {
        // 'main-header': '1.5rem',
        // 'header': '1.25rem',
        // 'nav': '1rem',
        // 'default': '1.15rem',
        // 'min': '.8rem',
      },
      borderRadius: {
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.cursor-default-important': {
          cursor: 'default',
        },
      })
    },
  ],
}
