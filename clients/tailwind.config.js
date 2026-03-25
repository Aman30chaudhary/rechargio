/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // Light Blue
          hover: "#2563EB",   // Accent hover
          soft: "#EFF6FF",    // Soft blue background
        },
        surface: {
          DEFAULT: "#FFFFFF", // White
          muted: "#F8FAFC",   // Soft background shades
          border: "#E2E8F0",  // Border color
        },
        text: {
          primary: "#0F172A", // Slate 900
          secondary: "#475569", // Slate 600
          muted: "#94A3B8",    // Slate 400
        }
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 40px -4px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
