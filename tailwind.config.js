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
                // Professional Admin Palette
                panel: {
                    dark: "#0f172a",
                    light: "#f8fafc",
                },
            },
            fontFamily: {
                inter: ["Inter", "sans-serif"],
                poppins: ["Poppins", "sans-serif"],
                outfit: ["Outfit", "sans-serif"],
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
                premium: "0 25px 50px -12px rgba(99, 102, 241, 0.15)",
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
            }
        },
    },
    plugins: [],
}

