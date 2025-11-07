import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "350px",
      },
      colors: {
        braveOrange: "#FB542B",
        bravePurple: "#7C3AED",
        braveBlue: "#0EA5E9",
        brand: {
          orange: "#FB542B",
          purple: "#7C3AED",
          blue: "#0EA5E9",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Consolas",
          "Monaco",
          "monospace",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(124, 58, 237, 0.4)",
        "glow-orange": "0 0 20px rgba(251, 84, 43, 0.4)",
        "glow-blue": "0 0 20px rgba(14, 165, 233, 0.4)",
      },
      backgroundImage: {
        "brave-gradient":
          "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(14,165,233,0.35), rgba(251,84,43,0.35))",
        "brave-gradient-intense":
          "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(14,165,233,0.5), rgba(251,84,43,0.5))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(124, 58, 237, 0.4)" },
          "100%": { boxShadow: "0 0 30px rgba(124, 58, 237, 0.8)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
