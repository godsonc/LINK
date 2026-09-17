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
        ink: "#1c2b2a",
        pine: "#1f4d4a",
        moss: "#3d6b57",
        sand: "#f4efe4",
        paper: "#fffdf8",
        clay: "#c46a3a",
        wheat: "#e7d3a1",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 12px 40px rgba(28, 43, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
