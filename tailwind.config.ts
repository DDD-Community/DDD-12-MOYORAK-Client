import type { Config } from 'tailwindcss';

const px0_10 = { ...Array.from(Array(11)).map((_, i) => `${i}px`) };
const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) };
const px0_200 = { ...Array.from(Array(201)).map((_, i) => `${i}px`) };

const config: Config = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	theme: {
		extend: {
			borderWidth: px0_10,
			fontSize: px0_100,
			lineHeight: px0_100,
			minWidth: px0_200,
			minHeight: px0_200,
			spacing: px0_200,

			colors: {
				primary: {
					light: '#4da6ff',
					DEFAULT: '#0078d4',
					dark: '#005a9e',
				},
				secondary: {
					light: '#f7fafc',
					DEFAULT: '#edf2f7',
					dark: '#cbd5e0',
				},
			},
			fontFamily: {
				sans: ['Pretendard', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Pretendard로 변경
			},
		},
	},
	plugins: [],
	darkMode: 'class',
};

export default config;
