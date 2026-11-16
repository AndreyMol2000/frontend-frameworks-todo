import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import globals from 'globals';

export default ts.config(
  { ignores: ['node_modules/**', '.quasar/**', 'dist/**', 'coverage/**', 'reports/**', '*.temporary.compiled.*'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node }, parserOptions: { parser: ts.parser } },
    rules: { 'vue/multi-word-component-names': 'off', 'vue/max-attributes-per-line': 'off', 'vue/html-self-closing': 'off', 'vue/singleline-html-element-content-newline': 'off' },
  },
  { files: ['**/*.cjs'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
);
