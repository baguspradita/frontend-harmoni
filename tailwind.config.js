/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {

            container: {
                center: true,
                padding: '1rem',
            },

            backgroundImage: {
                'packages': "url('@/assets/logo.jpeg')",
            },
            colors: {
                primary: "#0059C9",      // Bright Blue
                secondary: "#005E9D",    // Dark Blue
                tertiary: "#DD7301",     // Orange
                accent: "#DD7301",       // Orange - Alternative CTA
                neutral: "#F2F3F3",      // Light Gray background
                dark: "#1C1C1C",         // Dark text
                success: "#10B981",      // Emerald green
                warning: "#FCA311",      // Amber
                error: "#EF4444",        // Red
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
