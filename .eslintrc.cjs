// ESLint-Konfiguration für Node und Vue
module.exports = {
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  // Eigene Regeln können hier ergänzt werden
  rules: {}
}
