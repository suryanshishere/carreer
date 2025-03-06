/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    {
      //for dynamic rendering
      raw: `
      border-custom_green
      border-custom_pale_orange
      border-custom_gray
      border-custom_red
      border-custom_black 
      outline-custom_gray
      bg-custom_pale_orange
      bg-custom_gray
      bg-custom_green
      bg-custom_red
      bg-custom_black
    `,
    },
  ],
  theme: {
    extend: {
      //response view hook check co related
      screens: {
        mobile: "610px",
        medium_mobile: "710px",
        large_mobile: "1050px",
        tablet: "1200px",
        desktop: "1440px",
        extra_large: "1441px",
      },
      colors: {
        custom_red: "rgb(165, 42, 42)",
        custom_less_red: "rgba(165, 42, 42, 0.85)",
        custom_dark_red: "rgb(130, 17, 49)",
        custom_white: "rgba(255, 255, 255, 1)",
        custom_black: "#000000",
        custom_gray: "rgba(104, 109, 118)",
        custom_less_gray: "rgb(228, 224, 225)",
        // "custom-super-less-gray": "rgba(238, 238, 238, 0.25)",
        // "custom-backdrop": "#2C3333",
        custom_green: "#7F9F80",
        custom_dark_blue: "#131921",
        custom_blue: "#1679AB",
        custom_less_blue: "rgb(137, 168, 178)",
        custom_yellow: "rgb(231, 210, 131)",
        custom_pale_yellow: "#EBE4D1",
        custom_pale_orange: "#E8B86D",
      },
      borderWidth: {
        1: "1px",
      },
      spacing: {
        "main-nav": "3rem",
        // "main-nav-sm": "3.5rem",
        auth_nav: "5rem",
        sub_nav: "2rem",
        sub_nav_sm: "2.5rem",
        auth_sub_nav: "8rem",
        nav_overall: "8rem",
        footer: "5.5rem",
      },
      padding: {
        page: "13vw",
        page_small: "3vw",
        page_medium: "8vw",
        button: ".45rem .5rem", //y,x
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
        ".outline-custom_gray": {
          outlineColor: "rgba(104, 109, 118)",
        },
        // Add more custom outline colors if needed
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
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
