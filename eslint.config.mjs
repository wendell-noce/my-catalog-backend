import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts"],
    ignores: [
      "dist/**",
      "node_modules/**"
    ],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
    },

    rules: {
      ...tseslint.configs.recommended.rules,

      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-floating-promises": "error",

      complexity: ["warn", 10],
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true }],
      "max-depth": ["warn", 4],
      "no-console": "warn",
      "no-duplicate-imports": "error",
    },
  },
];
