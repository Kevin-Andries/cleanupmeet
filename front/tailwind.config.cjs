/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-[a-z]+-[0-9]+/,
    },
    "rounded",
  ],
  plugins: [],
};
