// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 💡 CRAの標準的なフォルダ構成をカバーする設定
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}