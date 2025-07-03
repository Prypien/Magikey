import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './theme/index.css'

import i18n from './i18n/index.js'

import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(plugin, defaultConfig)
app.mount('#app')
