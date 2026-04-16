/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest:    'var(--color-forest)',
        gold:      'var(--color-gold)',
        'gold-light': 'var(--color-gold-light)',
        offwhite:  'var(--color-offwhite)',
        dark:      'var(--color-dark)',
        muted:     'var(--color-muted)',
        surface:   'var(--color-surface)',
        border:    'var(--color-border)',
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
