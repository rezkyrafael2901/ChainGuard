import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        panel: "#0b1020",
        neon: "#34d399",
      },
    },
  },
  plugins: [],
};
export default config;
