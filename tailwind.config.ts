import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand pakai CSS variable (channel RGB) supaya bisa di-theme per-section.
        // Default = oranye (di :root). Landing page override jadi ungu (.theme-purple).
        brand: {
          DEFAULT: "rgb(var(--brand-500) / <alpha-value>)",
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
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
        cardHover: "0 12px 32px -4px rgb(var(--brand-500) / 0.18)",
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
