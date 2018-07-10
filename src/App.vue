<template>
  <div id="app">

    <app-header
      :active-color-scheme="ACTIVE_COLOR_SCHEME_KEY"
      :active-method="method"
      :handle-method-change="switchMethod"
    />

    <section class="section">
      <div class="container">
        <div class="columns">

          <div class="column is-two-thirds">
            <app-form
              :payload="payload"
              :active-color-scheme="ACTIVE_COLOR_SCHEME_KEY"
              :active-method="method"
              :handle-submit="handleSubmit"
              :loading="loading"
              :disabled="disabled"
              @payload-input="payload = $event.target.value"
            />
          </div>

          <div class="column">
            <app-error
              v-if="error != null"
              :error="error"
              @close="error=null"
            />
            <app-result
              v-if="result != null"
              :active-color-scheme="ACTIVE_COLOR_SCHEME_KEY"
              :result="result"
            />
          </div>

        </div>
      </div>
    </section>

    <a v-if="GITHUB_LINK" :href="GITHUB_LINK">
      <img
        style="position: absolute; top: 0; right: 0; border: 0;"
        src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
        alt="Fork me on GitHub"
      >
    </a>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          from <a href="https://www.pozetron.com">Pozetron</a> with <span class="icon is-small has-text-danger"><i class="fas fa-heart"></i></span><br>
        </p>
      </div>
    </footer>

  </div>
</template>

<script>
import './styles/main.scss'
import config from './../app.config.json'
import sassConfig from './../app.sass.config.json'
import axios from 'axios'
import Raven from 'raven-js'
import AppHeader from './components/Header.vue'
import AppForm from './components/Form.vue'
import AppResult from './components/Result.vue'
import AppError from './components/Error.vue'

// Prepeare some configs
const QRCODE_SERVICE =
  process.env.NODE_ENV === 'development'
    ? config.DEV_QRCODE_SERVICE
    : config.PROD_QRCODE_SERVICE
const RECAPTCHA_ENABLED = config.RECAPTCHA_SITE_KEY ? true : false

// Select a random color scheme
const COLOR_SCHEMES_KEYS = Object.keys(sassConfig.COLOR_SCHEMES)
const ACTIVE_COLOR_SCHEME_KEY = COLOR_SCHEMES_KEYS.length
  ? COLOR_SCHEMES_KEYS[Math.floor(Math.random() * COLOR_SCHEMES_KEYS.length)]
  : null

export default {
  name: 'app',
  components: {
    'app-header': AppHeader,
    'app-form': AppForm,
    'app-result': AppResult,
    'app-error': AppError
  },
  data() {
    return {
      ACTIVE_COLOR_SCHEME_KEY: ACTIVE_COLOR_SCHEME_KEY,
      GITHUB_LINK: config.GITHUB_LINK,
      method: 'text', // 'text' | 'base64'
      payload: '',
      recaptcha_ready: false,
      loading: false,
      result: null,
      error: null
    }
  },
  computed: {
    disabled: function() {
      return (
        !this.payload ||
        this.loading ||
        (RECAPTCHA_ENABLED && !this.recaptcha_ready)
      )
    }
  },
  mounted: function() {
    if (RECAPTCHA_ENABLED) {
      let recaptchaScript = document.createElement('script')
      recaptchaScript.onload = () => {
        window.grecaptcha.ready(() => {
          this.recaptcha_ready = true
        })
      }
      recaptchaScript.setAttribute(
        'src',
        `https://www.google.com/recaptcha/api.js?render=${
          config.RECAPTCHA_SITE_KEY
        }`
      )
      document.body.appendChild(recaptchaScript)
    }
  },
  methods: {
    switchMethod(m) {
      this.method = m
      this.payload = ''
    },
    fetchQRCode(recaptcha_token = null) {
      let data = new URLSearchParams()
      data.append(this.method, this.payload)
      data.append('color_scheme', this.ACTIVE_COLOR_SCHEME_KEY)

      if (recaptcha_token) {
        data.append('recaptcha', recaptcha_token)
      }

      axios
        .post(QRCODE_SERVICE, data, {
          responseType: 'arraybuffer'
        })
        .then(response => {
          if (response.status == 200) {
            this.result = `data:${
              response.headers['content-type']
            };base64,${btoa(
              String.fromCharCode.apply(null, new Uint8Array(response.data))
            )}`
          }
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          if (error.response) {
            let error_data = {}
            try {
              error_data = JSON.parse(
                String.fromCharCode.apply(
                  null,
                  new Uint8Array(error.response.data)
                )
              )
            } catch (e) {
              // Forgive only invalid json errors
              if (e.name !== 'SyntaxError') {
                throw e
              }
            }

            if (error.response.status == 400 && error_data.description) {
              this.error = error_data.description
            } else {
              this.error = 'Oops! Something went wrong.'
            }
          } else {
            this.error = 'Oops! Something went wrong.'
          }

          if (Raven.isSetup()) {
            Raven.captureMessage('Failed to generate barcode', {
              level: 'warning',
              extra: {
                error: error,
                response: error.response,
                data,
                description: this.error
              }
            })
          }
        })
    },
    handleSubmit() {
      this.result = null
      this.error = null
      this.loading = true

      if (RECAPTCHA_ENABLED) {
        window.grecaptcha
          .execute(config.RECAPTCHA_SITE_KEY, {action: 'homepage'})
          .then(
            token => {
              this.fetchQRCode(token)
            },
            error => {
              this.loading = false
              this.error = 'Oops! Could not verify you are not a robot.'

              if (Raven.isSetup()) {
                Raven.captureMessage(
                  'Failed to verify recaptcha on client-side',
                  {
                    level: 'warning',
                    extra: {
                      error
                    }
                  }
                )
              }
            }
          )
      } else {
        this.fetchQRCode()
      }
    }
  }
}
</script>
