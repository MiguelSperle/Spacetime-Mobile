/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.tsx', './src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        title: 'Roboto_700Bold',
        body: 'Roboto_400Regular',
        alt: 'BaiJamjuree_700Bold',
      },
    },
  },
  plugins: [],
}
