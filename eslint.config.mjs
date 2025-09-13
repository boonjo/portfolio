import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("eslint").ESLint.ConfigData} */
const config = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "next/typescript",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    /// TypeScript
    "@typescript-eslint/explicit-function-return-type": "off", // don’t require return types everywhere
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // warn about unused vars, ignore ones starting with _

    // General
    "no-console": ["warn", { allow: ["warn", "error"] }], // warn instead of error for console.log
    "no-debugger": "error", // forbid debugger statements

    // Prettier
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        semi: true,
        trailingComma: "all",
        printWidth: 100,
      },
    ],
  },
};

export default config;