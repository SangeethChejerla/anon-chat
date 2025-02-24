/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add any custom colors here
      },
      animation: {
        'pulse': 'pulse 2s infinite',
        'fade-out': 'fadeOut 0.5s ease-in-out forwards',
      },
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)' },
        },
        fadeOut: {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}