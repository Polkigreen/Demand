import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00C4B4", // Teal
          dark: "#00A395",
          light: "#E6FAF8",
        },
        secondary: {
          DEFAULT: "#FF7A00", // Orange
          dark: "#E06B00",
          light: "#FFF2E6",
        },
        darkBg: "#0F172A", // Slate 900
        cardBg: "#1E293B", // Slate 800
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
