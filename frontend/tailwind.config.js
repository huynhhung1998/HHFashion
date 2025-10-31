const { heroui } = require("@heroui/theme");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        borderRotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        
        fadeInText: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
     
        "border-spin": "borderRotate 1000s linear infinite",
      
        fadeInText: "fadeInText 1s ease-out",
      },
      plugins: [require('@tailwindcss/line-clamp')],
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
