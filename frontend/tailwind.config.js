/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    {
      //for dynamic rendering
      raw: `
      border-custom-green
      border-custom-pale-orange
      border-custom-gray
      border-custom-red
      border-custom-black 
      outline-custom-gray
    `,
    },
  ],
  theme: {
    extend: {
      colors: {
        "custom-red": "rgb(165, 42, 42)",
        "custom-less-red": "rgba(165, 42, 42, 0.85)",
        "custom-white": "rgba(255, 255, 255, 1)",
        "custom-less-white": "rgba(255, 255, 255, 0.75)",
        "custom-black": "#000000",
        "custom-gray": "rgba(104, 109, 118)",
        "custom-less-gray": "rgb(238, 238, 238)",
        // "custom-super-less-gray": "rgba(238, 238, 238, 0.25)",
        // "custom-backdrop": "#2C3333",
        "custom-green": "#7F9F80",
        "custom-dark-blue": "#131921",
        "custom-blue": "#1679AB",
        "custom-less-blue": "rgb(137, 168, 178)",
        "custom-yellow": "rgb(231, 210, 131)",
        "custom-pale-yellow": "#EBE4D1",
        "custom-pale-orange": "#E8B86D",
      },
      borderWidth: {
        1: "1px",
      },
      spacing: {
        "main-nav": "3rem",
        // "main-nav-sm": "3.5rem",
        "auth-nav": "5rem",
        "sub-nav": "2rem",
        "sub-nav-sm": "2.5rem",
        "auth-sub-nav": "8rem",
        "nav-overall": "8rem",
        "footer": "5.5rem",
      },
      padding: {
        page: "13vw",
        "page-small": "3vw",
        "page-medium":"8vw",
        "button": ".45rem .5rem", //y,x 
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.outline-custom-gray': {
          outlineColor: "rgba(104, 109, 118)",
        },
        // Add more custom outline colors if needed
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
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
