// https://www.tailwindcss.cn/docs/configuration

module.exports = {
    plugins: [require('daisyui')],
    daisyui: {
        darkTheme: 'light',
    },
    separator: '_',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        screens: {
            md: '768px',
            lg: '1200px',
            // xl: '1440px',
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            white: '#fff',
            black: '#000',
            gray: {
                ca: '#CACACA',
                d2: '#D2D2D2',
                f4: '#F4F4F4',
                eee: '#EEEEEE',
                fb: '#FBFBFB',
                DEFAULT: '#F9F9F9',
                ccc: '#ccc',
                666: '#666',
                999: '#999999',
                333: '#333',
            },
            green: {
                100: '#30A873',
                DEFAULT: '#30A873',
            },
            blue: {
                DEFAULT: '#0263FF',
            },
            main: {
                DEFAULT: '#1BA03A',
                content: '#F6FBF7'
            },
            red: {
                DEFAULT: '#e36956',
            },
            purple: {
                DEFAULT: '#7C53F2',
            },
        },
        minHeight: {
            40: "10rem",
        },
        extend: {
            spacing: {   // margin padding  height width
                90: '20rem',
                less2: "0.2rem",
                4: "1rem",
            },
            lineHeight: {
                2: "2rem"
            },
            container: {
                center: true,
            },
        },
    },
};
