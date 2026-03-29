import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from spec
        ind: "#2825A8",
        "ind-dk": "#1E1B6E",
        "ind-bg": "#ECEAFF",
        "ind-bd": "#AEAAE8",
        bg: "#FDFBF8",
        bg2: "#F6F3EE",
        bd: "#E4DDD3",
        t1: "#1A1208",
        t2: "#6B6155",
        t3: "#A89D92",
        "grn-t": "#15803D",
        amber: "#B45309",
        red: "#DC2626",
        // shadcn compatibility
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "#2825A8",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#ECEAFF",
          foreground: "#2825A8",
        },
        muted: {
          DEFAULT: "#F6F3EE",
          foreground: "#6B6155",
        },
        accent: {
          DEFAULT: "#ECEAFF",
          foreground: "#2825A8",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        border: "#E4DDD3",
        input: "#E4DDD3",
        ring: "#2825A8",
      },
      fontFamily: {
        sans: ["'Noto Sans TC'", "sans-serif"],
      },
      fontSize: {
        "2xs": ["11px", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
