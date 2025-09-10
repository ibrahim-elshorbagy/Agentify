import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-out',
            },
            screens: {
              xs: '480px',
              'max-xs': {'max': '479px'},
              'max-sm': {'max': '639px'},
              'max-md': {'max': '767px'},
              'max-lg': {'max': '1023px'},
              'max-xl': {'max': '1279px'},
            },
            colors: {
              green: {
                50:  '#EEF0E5',  // lightest
                100: '#DEE2D8',
                200: '#B6C4B6',  // your third color
                300: '#A0B397',
                400: '#7C9676',
                500: '#304D30',  // your second color (mid)
                600: '#2B432A',
                700: '#224122',
                800: '#163020',  // your darkest
                900: '#0F1F15',
              },
            },
        },
    },

    plugins: [forms],
};
