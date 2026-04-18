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
        brand: {
          primary:   "#0A0A0A",
          secondary: "#F8F6F2",
          accent:    "#C9A96E",
          surface:   "#FFFFFF",
          border:    "#E8E4DC",
          text:      "#1A1A1A",
          muted:     "#888888",
          inverse:   "#FFFFFF",
        },
        status: {
          success: "#3B6D11",
          warning: "#854F0B",
          error:   "#A32D2D",
          info:    "#185FA5",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        ui:      ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        sm:   "4px",
        md:   "8px",
        lg:   "16px",
        xl:   "24px",
        full: "9999px",
      },
      boxShadow: {
        card:  "0 2px 8px rgba(0,0,0,0.06)",
        hover: "0 12px 40px rgba(0,0,0,0.10)",
        focus: "0 0 0 3px rgba(201,169,110,0.25)",
      },
      animation: {
        "fade-in":  "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
