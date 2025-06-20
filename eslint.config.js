import eslint from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	reactRecommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			'react-hooks': reactHooksPlugin,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/exports': 'error',
			'@typescript-eslint/no-explicit-any': 0,
			'react/react-in-jsx-scope': 'off',
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						['^react', '^@?\\w'],
						['^(@|components)(/.*|$)'],
						['^\\u0000'],
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
						['^.+\\.?(css)$'],
					],
				},
			],
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': [
				'warn',
				{
					additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
				},
			],
			'react/prop-types': 'off',
			'react/display-name': 'off',

			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-empty-interface': 'warn',
			'@typescript-eslint/no-empty-function': 'warn',
			'@typescript-eslint/ban-ts-comment': 'warn',
			'@typescript-eslint/no-non-null-assertion': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-var-requires': 'warn',

			'react/jsx-no-duplicate-props': 'error',
			'react/jsx-no-undef': 'error',
			'react/jsx-pascal-case': 'error',
			'react/no-children-prop': 'error',
			'react/no-deprecated': 'error',
			'react/no-direct-mutation-state': 'error',
			'react/no-unescaped-entities': 'error',
			'react/self-closing-comp': [
				'error',
				{
					component: true,
					html: true,
				},
			],

			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'warn',
			'prefer-const': 'error',
			'no-unused-expressions': 'error',
			'no-duplicate-imports': 'error',
			eqeqeq: ['error', 'always'],
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
];
