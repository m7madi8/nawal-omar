/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './Zanzibar.html',
    './workshops/*.html',
    './js/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
}
