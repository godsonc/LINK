import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        field: "rgb(var(--field) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 16px 40px rgb(var(--ink) / 0.08)",
      },
      minHeight: {
        target: "2.75rem",
      },
      borderRadius: {
        card: "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
