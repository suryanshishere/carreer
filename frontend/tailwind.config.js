/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        "custom-red": "#A52A2A",
        "custom-less-red": "#F5004F",
        "custom-white": "rgba(255, 255, 255, 1)",
        "custom-less-white": "rgba(255, 255, 255, 0.75)",
        "custom-black": "#000000",
        "custom-gray": "rgba(104, 109, 118)",
        "custom-less-gray": "rgba(104, 109, 118, 0.75)",
        "custom-super-less-gray": "rgba(104, 109, 118, 0.25)",
        // "custom-backdrop": "#2C3333",
        "custom-green": "#7F9F80",
        "custom-dark-blue": "#131921",
        "custom-blue": "#1679AB",
        "custom-yellow": "#EEEBDD",
        "custom-pale-yellow": "#EBE4D1",
        "custom-pale-orange": "#E4C087",
      },
      spacing: {
        "main-nav": "3rem",
        "auth-nav": "5rem",
        "sub-nav": "2rem",
        "auth-sub-nav": "8rem",
        "nav-overall": "8rem",
        footer: "5.5rem",
      },
      padding: {
        page: "15vw",
        button: ".35rem .5rem", //y,x
      },
      gap: {},
      fontSize: {
        // 'main-header': '1.5rem',
        // 'header': '1.25rem',
        // 'nav': '1rem',
        // 'default': '1.15rem',
        // 'min': '.8rem',
      },
      borderRadius: {},
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".cursor-default-important": {
          cursor: "default",
        },
      });
    },
  ],
  corePlugins: {
    preflight: true,
  },
  variants: {
    extend: {
      textDecorationColor: ["visited"], // Enable visited variants
      decoration: ["visited"], // Enable decoration color for visited
    },
  },
};
