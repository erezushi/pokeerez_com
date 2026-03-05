import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { js, prettier },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      'prettier/prettier': [
        'warn',
        {},
        {
          usePrettierrc: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
          "argsIgnorePattern": "^_"
        },
      ],
    },
    settings: {
      react: { version: '19' },
    },
  },
  tseslint.configs.recommended,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

