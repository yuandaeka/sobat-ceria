/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        anton: ['"Anton"', 'sans-serif'],
        vietnam: ['"Be Vietnam Pro"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#8B22C0',
          primaryDark: '#701A9C',
          pastel: '#F4EBF7',
          navy: '#1B254B',
          orange: '#FF5E3A',
          cream: '#FAF6F0',
          blue: '#E2F1F8',
          green: '#DDF5E6',
          peach: '#FCEEE2',
          teal: '#05D3A2',
          lime: '#D6F833',
          pink: '#ff79c6',
          surface: '#fbf8ff',
          surfaceDim: '#d8d9e9',
        }
      },
    },
  },
  plugins: [],
}
