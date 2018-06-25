import configs from './configs'
import Vue from 'vue'
import App from './App.vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

Vue.config.productionTip = false

if (configs.SENTRY_KEY && configs.SENTRY_PROJECT) {
  Raven
    .config(`https://${configs.SENTRY_KEY}@sentry.io/${configs.SENTRY_PROJECT}`, {
      environment: process.env.NODE_ENV
    })
    .addPlugin(RavenVue, Vue)
    .install()
}

new Vue({
  render: h => h(App)
}).$mount('#app')
