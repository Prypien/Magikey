// Einstiegspunkt der Vue-Anwendung
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
// globale Styles laden
import './theme/index.css'

// FormKit-Plugin für Formulare registrieren
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

// App-Instanz erzeugen
const app = createApp(App)

// Router und Plugins einbinden
app.use(router)
app.use(plugin, defaultConfig)

// Anwendung an das #app-Element anhängen
app.mount('#app')
