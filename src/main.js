import config from './../app.config.json'
import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import App from './App.vue'

Vue.config.productionTip = false

if (config.SENTRY_API_URL) {
  Raven
    .config(`${config.SENTRY_API_URL}`, {
      environment: process.env.NODE_ENV
    })
    .addPlugin(RavenVue, Vue)
    .install()
}

new Vue({
  render: h => h(App)
}).$mount('#app')
