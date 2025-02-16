import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const typos = plugin(({ addComponents }) => {
  addComponents({
    ".typo-Display1": {
      fontSize: "64px",
      fontWeight: "600",
      fontStyle: "normal",
    },
    ".typo-Display2": {
      fontSize: "56px",
      fontWeight: "600",
      fontStyle: "normal",
    },
  });
});

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0C68F4",
        primary25: "#E4EEFE",
        primary50: "#AECDFB",
        primary75: "#78ABF9",
        primary100: "#428AF6",
        primary200: "#2779F5",
        primary400: "#0951BE",
        primary500: "#063A88",
        primary600: "#052E6D",
        primary700: "#042352",
        primary800: "#021736",

        secondary: "#F45E0C",
        secondary100: "#FDDBC9",
        secondary200: "#FAB793",
        secondary300: "#F68242",
        secondary400: "#F45E0C",
        secondary500: "#BE4909",
        secondary600: "#883406",

        error: "#C91433",
        errorLight: "#FAE7EB",
        success: "#198754",
        successLight: "#D1F7E5",
      },
    },
  },
  plugins: [typos],
} satisfies Config;
