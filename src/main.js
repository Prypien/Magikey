import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './theme/index.css'

import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

const app = createApp(App)

app.use(router)
app.use(plugin, defaultConfig)
app.mount('#app')
