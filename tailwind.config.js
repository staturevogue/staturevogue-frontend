/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F2B5B", // Deep Navy (Nobero style)
        secondary: "#242F66", // Lighter Navy for hovers
        accent: "#F4C430", // Gold/Yellow for badges
        success: "#00B852", // Green for discounts
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensure you have Inter imported in index.css or index.html
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 16px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [
    // We will use standard tailwind classes, but you might want to install @tailwindcss/forms later
  ],
}