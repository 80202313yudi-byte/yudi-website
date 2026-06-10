import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        card: "var(--color-card)",
        "card-soft": "var(--color-card-soft)",
        line: "var(--color-line)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)",
      },
      boxShadow: {
        glow: "0 0 42px rgba(201, 255, 69, 0.22)",
        panel: "0 32px 100px rgba(0, 0, 0, 0.38)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        panel: "28px",
      },
    },
  },
  plugins: [],
};

export default config;
