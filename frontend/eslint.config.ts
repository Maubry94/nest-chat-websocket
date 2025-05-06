import { duplojsEslintBase } from "@duplojs/eslint";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import path from "path";



const eslintConfigVue = [
	...pluginVue.configs["flat/strongly-recommended"],
	{
		...duplojsEslintBase,
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tseslint.parser,
				project: path.resolve(__dirname, "./tsconfig.app.json"),
				tsconfigRootDir: path.resolve(__dirname),
				globals: globals.browser,
				sourceType: "module",
				extraFileExtensions: [".vue"],
			},
		},
		files: ["**/*.ts", "**/*.vue"],
		ignores: ["**/*.test.ts", "eslint.config.ts"],
	},
];

export default eslintConfigVue;