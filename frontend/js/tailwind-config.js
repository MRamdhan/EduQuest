/**
 * EduQuest — Konfigurasi Tailwind
 * Dipakai oleh Tailwind Play CDN di index.html.
 */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Baloo 2', 'cursive', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f2ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95',
        },
        ink: { 700: '#3c2e82', 800: '#2a1f6b', 900: '#1e1650', 950: '#150d3a' },
      },
      boxShadow: {
        card: '0 8px 24px -12px rgba(109, 40, 217, 0.18)',
        btn: '0 4px 0 0 #4c1d95',
      },
      keyframes: {
        modalZoom: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(12px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        }
      },
      animation: { modalZoom: 'modalZoom 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }
    }
  }
};
