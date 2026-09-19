/** @type {import("typescript-eslint").Config} */
import tseslint from "typescript-eslint";
import xoConfig from "eslint-config-xo";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import importX from "eslint-plugin-import-x";
import unicorn from "eslint-plugin-unicorn";
import n from "eslint-plugin-n";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config(
	{
		ignores: [
			"next-env.d.ts",
			".next/**",
			"**/next-env.d.ts",
			"eslint.config.mjs",
			"src/data/calendar.json",
		],
	},
	...xoConfig({ prettier: 'compat', semicolon: true }),
	{
		files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
			"prettier": prettierPlugin,
		},
		rules: {
			"prettier/prettier": "error",
			"import-x/order": "off",
			"import-x/newline-after-import": "off",
			"import-x/no-duplicates": "off",
			"new-cap": "off",
			"@typescript-eslint/triple-slash-reference": "off",
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variable",
					format: ["camelCase", "PascalCase"],
				},
			],
			"unicorn/filename-case": "off",
			"import-x/extensions": "off",
			"unicorn/prefer-node-protocol": "off",
			"n/prefer-global/process": "off",
			"@stylistic/quotes": ["error", "double"],
		},
	},
	prettierConfig,
);
