/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sap: {
          blue: '#0a6ed1',
          dark: '#1c2d42',
          light: '#f5f7fa',
          gold: '#df6e0c',
          border: '#d9e1e8',
          accent: '#354a5f',
          surface: '#ffffff',
          sidebar: '#111827',
          sidebarHover: '#1f2937'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace']
      }
    },
  },
  plugins: [],
}
