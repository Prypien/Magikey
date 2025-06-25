// eslint.config.js
import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'
import parser from 'vue-eslint-parser'

export default [
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser, // Vue-Parser aktivieren
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: { vue },
    rules: {
      ...eslint.configs.recommended.rules,
      ...vue.configs['vue3-essential'].rules,
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: { vue },
    rules: {
      ...eslint.configs.recommended.rules,
    },
  },
]
