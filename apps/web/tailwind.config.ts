import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        braveOrange: "#FB542B",
        bravePurple: "#7C3AED",
        braveBlue: "#0EA5E9",
      },
      backgroundImage: {
        "brave-gradient":
          "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(14,165,233,0.35), rgba(251,84,43,0.35))",
      },
    },
  },
  plugins: [],
} satisfies Config;
