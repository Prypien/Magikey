// eslint.config.js
import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'
import parser from 'vue-eslint-parser'
import globals from 'globals'

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
        ...globals.browser,
        ...globals.es2021,
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
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: { vue },
    rules: {
      ...eslint.configs.recommended.rules,
    },
  },
  {
    files: [
      'vite.config.js',
      'postcss.config.cjs',
      'tailwind.config.js',
      'eslint.config.js',
      'functions/**/*.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
]
