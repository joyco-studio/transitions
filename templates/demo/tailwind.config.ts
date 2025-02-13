import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FAFAFA',
        background: '#181617',
        accent: '#0344DC',
      },
      fontFamily: {
        sans: [
          '"Barlow Condensed"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      spacing: {
        header: 'var(--header-height)',
      },
      keyframes: {
        'move-stripes': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '-80px 0' },
        },
      },
      animation: {
        'move-stripes': 'move-stripes 2s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
