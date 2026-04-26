module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'plugin:promise/recommended',
    'prettier',
  ],
  plugins: ['simple-import-sort', 'jsdoc', 'promise', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'jsdoc/require-param-type': 'off',
  },
};
