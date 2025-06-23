import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	theme: {
		extend: {
			spacing: {},
			fontSize: {},
			lineHeight: {},

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
