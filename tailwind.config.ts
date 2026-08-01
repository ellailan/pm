import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Core Neutrals ───
        black: "#000000",

        // Deep Navy — primary dark text / accents
        navy: {
          50: "#ECF2FB",
          100: "#D0E3F7",
          200: "#9DBFFA",
          300: "#6A9AE7",
          400: "#3776D5",
          500: "#1C5BBF",
          600: "#134A99",
          700: "#0F3A7A",
          800: "#0D2947", /* Deep Navy */
          900: "#061226",
          950: "#03070E",
        },

        // Pale Yellow — page background
        gold: {
          50: "#FFFCF0",
          100: "#FEFAE0",
          200: "#FEF6B6", /* Pale Yellow */
          300: "#FDEF89",
          400: "#FCDE5A",
          500: "#FBCC2B",
          600: "#D3A31E",
          700: "#9A7A15",
          800: "#624E0C",
          900: "#2F2403",
        },

        // Purple — primary accent
        plum: {
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D5BCFF",
          400: "#C4A2FF",
          500: "#A053AA", /* Purple */
          600: "#824391",
          700: "#653578",
          800: "#482660",
          900: "#2B1848",
        },

        // Mint Green — secondary accent / status
        mint: {
          50: "#EEFFF8", /* Light Mint */
          100: "#D9F5EE",
          200: "#C4F0E2",
          300: "#AEE6D6",
          400: "#AED8C6", /* Mint Green */
          500: "#82C4AD",
          600: "#66B096",
          700: "#4A9C7F",
          800: "#358767",
          900: "#20704F",
        },

        // Pink — accent
        pink: {
          50: "#FFF0F8",
          100: "#FFE4EF",
          200: "#FFD1E0",
          300: "#E7AEC2", /* Pink */
          400: "#D48FB4",
          500: "#C2709F",
          600: "#AF5F89",
          700: "#9C4F73",
          800: "#8A3F5D",
          900: "#772F47",
        },

        // Light Lavender — decorative
        "light-lavender": "#D5AFDA",

        // Surface — neutral grays for borders & text
        surface: {
          50: "#FAFAFB",
          100: "#F5F5F7",
          200: "#E5E5E7",
          300: "#D1D1D6",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#0F0F10",
        },

        // Ticket status colors (soft pastels from new palette)
        status: {
          open: "#AED8C6", /* Mint Green */
          in_progress: "#BFDBFE",
          review: "#FEF6B6", /* Pale Yellow */
          completed: "#C4A2FF", /* Purple tint */
          archived: "#D1D5DB",
        },
      },

      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },

      borderRadius: {
        hand: "0.625rem",
        "hand-lg": "1rem",
        "hand-xl": "1.25rem",
      },

      boxShadow: {
        /* Soft modern shadows — no hard offsets */
        "brutal-sm": "0 1px 3px 0px rgba(0, 0, 0, 0.06)",
        "brutal-md": "0 2px 6px 0px rgba(0, 0, 0, 0.06)",
        "brutal-lg": "0 4px 12px 0px rgba(0, 0, 0, 0.06)",
        "brutal-xl": "0 8px 20px 0px rgba(0, 0, 0, 0.06)",
        "brutal-yellow": "0 2px 6px 0px rgba(254, 246, 182, 0.30)",
        "brutal-purple": "0 2px 6px 0px rgba(160, 83, 170, 0.30)",
        "brutal-blue": "0 2px 6px 0px rgba(13, 41, 71, 0.20)",
      },

      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
