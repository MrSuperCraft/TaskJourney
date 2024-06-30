// tailwind.config.js
import { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "max-sm": { max: "640px" }, // Maximum width for small screens
        "max-md": { max: "768px" }, // Maximum width for medium screens
        "max-lg": { max: "1024px" }, // Maximum width for large screens
      },
      colors: {
        primary: {
          50: "#f0fdf9",
          100: "#cdfaec",
          200: "#9cf3da",
          300: "#62e6c5",
          400: "#32cfad",
          500: "#1abc9c",
          600: "#11907a",
          700: "#127362",
          800: "#135c51",
          900: "#154c44",
          950: "#052e29",
        },
        "primary-brand": {
          50: "#F7FBFD",
          100: "#EFF8FA",
          200: "#E0F0F5",
          300: "#CCE7F0",
          400: "#BDDFEB",
          500: "#ADD8E6",
          600: "#6EBAD3",
          700: "#3898B8",
          800: "#26677D",
          900: "#13343F",
          950: "#0A1A1F",
        },

        cyan: {
          50: "#E9FBF8",
          100: "#D8F8F4",
          200: "#B1F1EB",
          300: "#8AEBE4",
          400: "#63E4E0",
          500: "#3BDDDD",
          600: "#21BFBA",
          700: "#198F87",
          800: "#116058",
          900: "#08302B",
          950: "#041613",
        },

        "priority-high": "#ff4757", // red
        "priority-medium": "#ffd166", // yellow
        "priority-low": "#2ecc71", // green
        "priority-default": "#bdc3c7", // gray

        "dark-cyan": "#008B8B", // Dark Cyan
        "light-cyan": "#E0FFFF", // Light Cyan
        teal: "#008080", // Teal
        aqua: "#00CED1", // Aqua
        "navy-blue": "#000080", // Navy Blue
        "sky-blue": "#87CEEB", // Sky Blue
        "dark-primary-brand": "#0D6E8D", // Dark mode primary
        "darker-cyan": "#0D646E", // Dark mode cyan
        "dark-teal": "#0D5A60", // Dark mode teal
        "dark-navy-blue": "#05052A", // Dark mode navy blue
        "dark-sky-blue": "#00647A", // Dark mode sky blue
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"], // Inter for headings
        lato: ["Lato", "sans-serif"], // Lato for body text
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    nextui({
      themes: {
        colors: {
          colors: {
            primary: {
              DEFAULT: "#1abc9c",
              50: "#f0fdf9",
              100: "#cdfaec",
              200: "#9cf3da",
              300: "#62e6c5",
              400: "#32cfad",
              500: "#1abc9c",
              600: "#11907a",
              700: "#127362",
              800: "#135c51",
              900: "#154c44",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;

export default config;
