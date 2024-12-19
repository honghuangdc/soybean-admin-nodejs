const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-plugin-prettier');
const path = require('path');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      'import': importPlugin,
      'prettier': prettier,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'pathGroups': [
          {
            'pattern': '@src/**',
            'group': 'internal',
            'position': 'after'
          },
          {
            'pattern': '@src/infra/**',
            'group': 'internal',
            'position': 'after'
          },
          {
            'pattern': '@src/lib/**',
            'group': 'internal',
            'position': 'after'
          },
          {
            'pattern': '@config/**',
            'group': 'internal',
            'position': 'after'
          },
          {
            'pattern': '@tests/**',
            'group': 'internal',
            'position': 'after'
          },
          {
            'pattern': '@lib/**',
            'group': 'internal',
            'position': 'after'
          }
        ],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [path.join(__dirname, './tsconfig.json')]
        }
      }
    },
    ignores: ['.eslintrc.js'],
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    }
  }
];
