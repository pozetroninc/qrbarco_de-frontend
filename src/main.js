import config from '../app.config.json'
import {createApp} from 'vue'
import * as Sentry from '@sentry/vue'
import App from './App.vue'

const app = createApp(App)

if (config.SENTRY_API_URL) {
  Sentry.init({
    app,
    dsn: config.SENTRY_API_URL,
    environment: import.meta.env.MODE
  })
}

app.mount('#app')
