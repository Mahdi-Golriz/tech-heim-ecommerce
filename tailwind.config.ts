import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        "2xl": "108px",
      },
    },
    extend: {
      backgroundImage: {
        "radial-blue":
          "radial-gradient(ellipse at center bottom, #052E6D, #021736 40%)",
      },
      boxShadow: {
        cart: "-2px 2px 15px -1px rgba(113, 113, 113, 0.12)",
      },
      colors: {
        primary: {
          DEFAULT: "#0C68F4",
          "25": "#E4EEFE",
          "50": "#AECDFB",
          "75": "#78ABF9",
          "100": "#428AF6",
          "200": "#2779F5",
          "400": "#0951BE",
          "500": "#063A88",
          "600": "#052E6D",
          "700": "#042352",
          "800": "#021736",
        },
        secondary: {
          DEFAULT: "#F45E0C",
          "100": "#FDDBC9",
          "200": "#FAB793",
          "300": "#F68242",
          "400": "#F45E0C",
          "500": "#BE4909",
          "600": "#883406",
        },
        error: {
          DEFAULT: "#C91433",
          light: "#FAE7EB",
        },
        success: {
          DEFAULT: "#198754",
          light: "#D1F7E5",
        },
      },
    },
    plugins: [tailwindcssAnimate],
  },
} satisfies Config;
