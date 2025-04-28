
import type { Config } from "tailwindcss";

export default {
  darkMode: ["media"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF8133",
          foreground: "#FAFAF8",
        },
        muted: {
          DEFAULT: "#1A1F2C",
          foreground: "#8A898C",
        },
        accent: {
          DEFAULT: "#221F26",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#1A1F2C",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(-25%)" },
          "50%": { transform: "translateY(-35%)" },
        },
        // Add swipe animations here
        "swipe-left": {
          "0%": { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateX(-100vw) rotate(-30deg)", opacity: "0" },
        },
        "swipe-right": {
          "0%": { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateX(100vw) rotate(30deg)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "swipe-left": "swipe-left 0.4s ease-out forwards",
        "swipe-right": "swipe-right 0.4s ease-out forwards",
      },
      gridTemplateColumns: {
        stretch: "repeat(auto-fit, minmax(0, 1fr))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
