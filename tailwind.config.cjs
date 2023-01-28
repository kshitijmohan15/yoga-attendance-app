/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          dark: {
            100: "#d0d0d5",
            200: "#a1a2ab",
            300: "#737380",
            400: "#444556",
            500: "#15162c",
            DEFAULT: "#15162c",
            600: "#111223",
            700: "#0d0d1a",
            800: "#080912",
            900: "#040409"
          },
          light: {
            100: "#f9fafc",
            200: "#f3f6f9",
            300: "#eef1f6",
            400: "#e8edf3",
            500: "#e2e8f0",
            DEFAULT: "#e2e8f0",
            600: "#b5bac0",
            700: "#888b90",
            800: "#5a5d60",
            900: "#2d2e30"
          }
        }
      }
    },
  },
  plugins: [],
};

