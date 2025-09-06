/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // optional: switch with a `.dark` class on <html> or <body>
  theme: {
    extend: {
      colors: {
        // dark glassy palette
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#2a2556",
        },
        accent: {
          DEFAULT: "#f472b6", // pink-ish
          500: "#f472b6",
          600: "#ec4899",
        },
        glass: {
          1: "rgba(255,255,255,0.04)",
          2: "rgba(255,255,255,0.06)",
          3: "rgba(255,255,255,0.10)",
        },
      },
      boxShadow: {
        "glass-sm": "0 1px 8px rgba(2,6,23,0.45)",
        "glass-md": "0 8px 30px rgba(2,6,23,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        "2xl-3": "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [
    // enable if you want forms and prose utilities (install @tailwindcss/forms and typography)
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
