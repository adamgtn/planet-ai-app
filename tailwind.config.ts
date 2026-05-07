import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF6B00",
          50: "#FFF3EA",
          100: "#FFE2C9",
          200: "#FFC79A",
          300: "#FFA866",
          400: "#FF8B33",
          500: "#FF6B00",
          600: "#E05E00",
          700: "#B84D00",
          800: "#8A3A00",
          900: "#5C2700",
        },
        ink: "#2D2D2D",
        canvas: "#FFFFFF",
        muted: "#F4F4F4",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(45, 45, 45, 0.08)",
        cardHover: "0 12px 32px -4px rgba(255, 107, 0, 0.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
