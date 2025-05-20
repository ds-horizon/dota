/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
          lightest: 'var(--primary-lightest)',
          foreground: 'var(--primary-foreground)',
        },
        'primary-accent': 'var(--primary-accent)',
        'text-heading': 'var(--text-heading)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'page-background': 'var(--bg-page-background)',
        'section-bg': 'var(--bg-section-bg)',
        card: 'var(--bg-card)',
        'border-color': 'var(--border-color)',
        'border-strong': 'var(--border-color-strong)',
      },
      transitionProperty: { 
        'max-height': 'max-height'
      },
      transformOrigin: { 
        top: 'top'
      },
      scale: { 
        '0': '0', 
        '100': '1'
      },
    },
  },
  plugins: [],
}