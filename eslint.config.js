// eslint.config.js
import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'
import parser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist', 'functions']
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser, // Vue-Parser aktivieren
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: { vue },
    rules: {
      ...eslint.configs.recommended.rules,
      ...vue.configs['vue3-essential'].rules,
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        window: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: { vue },
    rules: {
      ...eslint.configs.recommended.rules,
    },
  },
]
