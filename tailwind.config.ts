import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	theme: {
		extend: {
			spacing: {},
			fontSize: {},
			lineHeight: {},
			boxShadow: {
				'gray-custom': '0 0 14px 0 rgba(102, 102, 102, 0.20)',
			},
			colors: {
				primary: {},
				secondary: {},
			},
			fontFamily: {},
		},
	},
	plugins: [],
	darkMode: 'class',
};

export default config;
