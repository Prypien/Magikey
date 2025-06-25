// Moderne ESLint-Konfiguration
import eslint from '@eslint/js'
import vue from 'eslint-plugin-vue'

export default [
  {
    files: ['**/*.js', '**/*.vue'],
    ignores: ['node_modules'],
    languageOptions: { ecmaVersion: 2021, sourceType: 'module' },
    plugins: { vue },
    rules: {
      ...eslint.configs.recommended.rules,
      ...vue.configs['vue3-essential'].rules
    }
  }
]

// Weitere Konfigurationen können hier angefügt werden
