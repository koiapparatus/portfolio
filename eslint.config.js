import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'off'
    }
  }
];
