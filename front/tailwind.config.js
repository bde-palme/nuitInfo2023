/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,css,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        space: ['Space Grotesk', "sans-serif"]
      },
      flexGrow: {
        2: '2',
        3: '3',
        10: '10',
      },
      flexShrink: {
        2: '2',
        3: '3',
        10: '10',
      },
    },
  },
<<<<<<< Updated upstream
  plugins: [
    require("tailwind-scrollbar")
  ],
=======
  plugins: [],
>>>>>>> Stashed changes
}

