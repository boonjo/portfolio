// eslint.config.mjs
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    extends: ["next/core-web-vitals", "next/typescript", "plugin:prettier/recommended"],
    rules: {
      "no-console": "warn",
      "prettier/prettier": ["error", { singleQuote: true, semi: true }],
    },
  },
];
