/** @type {import('tailwindcss').Config} */
module.exports = {
  extend: {
  keyframes: {
    float: {
      "0%, 100%": {
        transform: "translateY(0px) translateX(0px) rotate(0deg)",
      },
      "25%": {
        transform: "translateY(-20px) translateX(10px) rotate(3deg)",
      },
      "50%": {
        transform: "translateY(0px) translateX(20px) rotate(-2deg)",
      },
      "75%": {
        transform: "translateY(20px) translateX(-10px) rotate(2deg)",
      },
    },
  },
  animation: {
    float: "float 12s ease-in-out infinite",
  },
},

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'gradient-slow': 'gradient 15s ease infinite',
        'float': 'float 12s ease-in-out infinite',
        'float-delayed': 'float 16s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'left center',
          },
          '50%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'right center',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0) rotate(0deg)',
          },
          '25%': {
            transform: 'translateY(-20px) translateX(15px) rotate(6deg)',
          },
          '50%': {
            transform: 'translateY(0px) translateX(25px) rotate(0deg)',
          },
          '75%': {
            transform: 'translateY(20px) translateX(15px) rotate(-6deg)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  extend: {
  keyframes: {
    float: {
      "0%, 100%": { transform: "translateY(0px) translateX(0px) rotate(0deg)" },
      "50%": { transform: "translateY(-20px) translateX(10px) rotate(5deg)" },
    },
  },
  animation: {
    float: "float 10s ease-in-out infinite",
  },
}

}
