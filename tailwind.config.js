/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest:    'rgb(var(--color-forest) / <alpha-value>)',
        gold:      'rgb(var(--color-gold) / <alpha-value>)',
        'gold-light': 'rgb(var(--color-gold-light) / <alpha-value>)',
        offwhite:  'rgb(var(--color-offwhite) / <alpha-value>)',
        dark:      'rgb(var(--color-dark) / <alpha-value>)',
        muted:     'rgb(var(--color-muted) / <alpha-value>)',
        surface:   'rgb(var(--color-surface) / <alpha-value>)',
        border:    'rgb(var(--color-border) / <alpha-value>)',
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
