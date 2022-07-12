const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
      },
      keyframes: {
        wave: {
          "0%": { transform: "scale(1.05,1.05)" },
          "10%": { transform: "scale(.95, .95)" },
          "20%": { transform: "scale(1.05, 1.05)" },
          "30%": { transform: "scale(.95, .95)" },
          "40%": { transform: "scale(1.05, 1.05)" },
          "50%": { transform: "scale(.95, .95)" },
          "60%": { transform: "scale(1.05, 1.05)" },
          "100%": { transform: "scale(1, 1)" },
        },
      },
      animation: {
        "waving-hand": "wave 1s linear infinite",
      },
    },
  },
  plugins: [],
});
