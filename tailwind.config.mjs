/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        cargo: {
          deep: '#0F3E51',
          light: '#A0DDF5',
          emerald: '#10B981',
          ink: '#0A1F2B',
          mist: '#F5F8FA',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15,62,81,.18)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
