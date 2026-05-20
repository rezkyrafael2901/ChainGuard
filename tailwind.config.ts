import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        panel: "#0b1020",
        neon: "#34d399",
      },
      boxShadow: {
        glow: "0 0 80px rgba(52, 211, 153, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
