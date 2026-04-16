/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest:    '#1A3C2B',
        gold:      '#D4A853',
        'gold-light': '#F0D898',
        offwhite:  '#F5F0E8',
        dark:      '#0E1A14',
        muted:     '#6B7C6E',
        surface:   '#EDE8DF',
        border:    '#D6CFC3',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['Plus Jakarta Sans', 'sans-serif'],
      },
      letterSpacing: {
        'tight-brand': '-0.02em',
        'wide-brand':  '0.04em',
        'wider-brand': '0.08em',
        'widest-brand':'0.1em',
      },
    },
  },
  plugins: [],
}
