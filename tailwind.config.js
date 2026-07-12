/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/script.js"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b3340",
        "ink-soft": "#49636b",
        aqua: "#bfeef5",
        "aqua-soft": "#edfafd",
        "aqua-strong": "#066f82",
        apricot: "#ffb672",
        "apricot-soft": "#fff5ea",
        line: "#cfe5e9"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 22px 60px -30px rgba(11, 51, 64, 0.28)",
        lift: "0 18px 40px -22px rgba(11, 51, 64, 0.35)"
      },
      maxWidth: {
        page: "88rem"
      }
    }
  },
  plugins: []
};
