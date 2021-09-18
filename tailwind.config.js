module.exports = {
  mode: "jit",
  purge: ["./client/public/index.html"],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ["'Inter'", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
