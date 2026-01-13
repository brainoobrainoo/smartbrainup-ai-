import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        text: '#252525',
        background: '#ffffff',
        muted: '#f4f4f4',
        dark: '#131313',
      },
      fontFamily: {
        editorial: ['var(--font-crimson)', 'serif'],
        ui: ['var(--font-inter)', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
