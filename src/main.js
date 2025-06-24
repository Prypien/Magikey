import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './theme/index.css'

// 🔑 FormKit Imports
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis' // Optional – nur wenn du das Basistheme nutzen willst

const app = createApp(App)

app.use(router)
app.use(plugin, defaultConfig) // FormKit aktivieren
app.mount('#app')
