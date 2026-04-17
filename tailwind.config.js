/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a4d6d",
        secondary: "#d4a574",
        accent: "#2ecc71",
        neutral: "#f5f7fa",
        dark: "#2c3e50",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
        "4xl": "64px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.1)",
        medium: "0 20px 40px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
}
