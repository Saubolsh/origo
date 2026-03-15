import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/entities/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        origo: {
          black: "#0a0a0a",
          charcoal: "#141414",
          slate: "#1a1a1a",
          zinc: "#27272a",
          silver: "#a1a1aa",
          white: "#fafafa",
          accent: "#c9a227",
          accentHover: "#d4af37",
          muted: "#71717a",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-geist-mono)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
