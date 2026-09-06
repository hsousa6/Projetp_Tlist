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
        dark: {
          bg: '#151515',
          card: '#1A1A18',
          input: '#1C2627',
          completed: '#1B242B',
          header: '#1E2529',
          focus: '#0D2235',
          btnPlus: '#F8EAE1',
          btnPlusText: '#151515',
          fileIcon: '#334456',
          delete: '#E24B4A',
          save: '#5B8DEF',
          textMain: '#F1EFEA',
          textSec: '#8A8A88',
        },
        light: {
          bg: '#B9D8EC',
          card: '#BFE2E4',
          cardSec: '#9CC9CF',
          header: '#9CC9CF',
          input: '#E4F5FD',
          completed: '#85B4BA',
          checkGreen: '#7FD9A8',
          fileIcon: '#42454A',
          btnPlus: '#BCE5DD',
          editPanel: '#8FB5BE',
          save: '#98CFCA',
          delete: '#E8836E',
          textMain: '#1A2425',
          textSec: '#9099A0',
        }
      },
      boxShadow: {
        'card-dark': '0 20px 45px -15px rgba(0, 0, 0, 0.7)',
        'card-light': '0 20px 45px -15px rgba(60, 110, 130, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
