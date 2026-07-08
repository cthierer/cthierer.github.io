import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: ['node_modules/**', 'dist/**'],
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.nodeBuiltin,
				...globals.node,
			},
			sourceType: 'module',
		},
	},
	prettier,
)
