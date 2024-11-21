 // Code generated via "Slingshot" 
// eslint.config.js
import { Linter } from 'eslint';

export default new Linter.Config({
  // Specify the environment
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // Extend recommended configurations
  extends: [
    'eslint:recommended',
    'plugin:react/recommended', // If you're using React
  ],
  // Specify the parser options
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  // Define global variables
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  // Add custom rules
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'semi': ['error', 'always'],
  },
});
