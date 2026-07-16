/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ochre: {
          50: "#fbf5ea",
          100: "#f3e6c8",
          200: "#e8cd93",
          300: "#dbb066",
          400: "#cc9445",
          500: "#b8792f",
          600: "#a8672b",
          700: "#8a5124",
          800: "#6f4222",
          900: "#5c371f",
          950: "#331c0f",
        },
        ink: "#2b2118",
        cream: "#fdfaf4",
        sage: "#7c8768",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(43, 33, 24, 0.08)",
      },
    },
  },
  plugins: [],
};
