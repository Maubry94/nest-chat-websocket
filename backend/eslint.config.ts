import { duplojsEslintBase, duplojsEslintTest } from "@duplojs/eslint";

const eslintConfig = [
	{
		...duplojsEslintTest,
		files: ["**/*.test.ts"],
	},
	{
		...duplojsEslintBase,
		files: ["**/*.ts"],
		ignores: ["**/*.test.ts"],
		rules: {
			...duplojsEslintBase.rules,
			"new-cap": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/consistent-type-imports": "off",
		},
	},
];

export default eslintConfig;
