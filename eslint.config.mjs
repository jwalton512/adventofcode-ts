import { fileURLToPath } from 'url'
import path from 'path'

import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import prettier from 'eslint-config-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{ts,tsx,js}'],
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/build',
      '**/coverage',
      '**/*.d.ts',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    rules: {
      // Base JS rules
      ...js.configs.recommended.rules,

      // TS rules
      ...tsPlugin.configs.recommended.rules,

      // We let unused-imports handle this instead
      '@typescript-eslint/no-unused-vars': 'off',

      // Unused imports/vars cleanup
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // Prettier last to turn off conflicting stylistic rules
  prettier,
]
