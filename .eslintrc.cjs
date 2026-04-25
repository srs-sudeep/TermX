/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    // ── React ──────────────────────────────────────────────────────────────
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react-hooks/exhaustive-deps': 'warn',

    // ── TypeScript ─────────────────────────────────────────────────────────
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',

    // ── Architecture: import boundaries ───────────────────────────────────
    // Commands must not import from components or hooks.
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/components/**', '**/hooks/**'],
            importNames: [],
            message:
              'Commands must not import from components or hooks. Use types and lib only.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      // Relax import boundary rule for everything outside src/commands/
      files: ['src/components/**', 'src/hooks/**', 'src/store/**', 'src/App.tsx', 'src/main.tsx'],
      rules: { 'no-restricted-imports': 'off' },
    },
    {
      // Allow any in test helpers
      files: ['tests/**/*.ts', 'tests/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
    {
      // Node / config files
      files: ['vite.config.ts', 'tailwind.config.ts', 'postcss.config.js'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
};
