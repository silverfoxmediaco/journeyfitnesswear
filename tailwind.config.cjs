/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'jfw-blue': '#00CFFF',
        'jfw-black': '#000000',
        'jfw-white': '#FFFFFF',
        'jfw-dark': '#0A0A0A',
        'jfw-gray': '#1A1A1A',
        'jfw-blue-dark': '#009FCC',
        'jfw-blue-glow': 'rgba(0, 207, 255, 0.3)',
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'jfw-glow': '0 0 20px rgba(0, 207, 255, 0.3)',
        'jfw-glow-lg': '0 0 40px rgba(0, 207, 255, 0.4)',
      },
    },
  },
  plugins: [],
};
