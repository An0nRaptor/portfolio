/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
                mono: ['"JetBrains Mono"', "ui-monospace", "monospace"]
            },
            colors: {
                // One accent, used sparingly: links, highlights, focus.
                accent: {
                    50: "#effcfb",
                    100: "#d0f5f2",
                    200: "#a2ebe6",
                    300: "#6bd9d4",
                    400: "#38bfbd",
                    500: "#1fa3a3",
                    600: "#168385",
                    700: "#16696b",
                    800: "#175456",
                    900: "#174648"
                }
            },
            maxWidth: { content: "72rem" }
        }
    },
    plugins: []
};
