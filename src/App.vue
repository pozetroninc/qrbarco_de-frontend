<template>
  <div id="app">

    <AppHeader
      :active-method="method"
      @method-change="switchMethod"
    />

    <section class="section">
      <div class="container">
        <div class="columns">

          <div class="column is-two-thirds">
            <AppForm
              :payload="payload"
              :active-method="method"
              :loading="loading"
              :disabled="disabled"
              @submit="handleSubmit"
              @payload-input="payload = $event.target.value"
            />
          </div>

          <div class="column">
            <AppError
              v-if="error != null"
              :error="error"
              @close="error = null"
            />
            <AppResult
              v-if="result != null"
              :result="result"
            />
          </div>

        </div>
      </div>
    </section>

    <a v-if="GITHUB_LINK" :href="GITHUB_LINK">
      <img
        style="position: absolute; top: 0; right: 0; border: 0;"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png"
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

<script setup>
import {ref, computed, onMounted} from 'vue'
import * as Sentry from '@sentry/vue'
import axios from 'axios'
import config from '../app.config.json'
import {getRandomColorScheme, applyColorScheme} from './colorSchemes.js'
import './styles/main.scss'
import AppHeader from './components/Header.vue'
import AppForm from './components/Form.vue'
import AppResult from './components/Result.vue'
import AppError from './components/Error.vue'

const QRCODE_SERVICE =
  import.meta.env.MODE === 'development'
    ? config.DEV_QRCODE_SERVICE
    : config.PROD_QRCODE_SERVICE
const RECAPTCHA_ENABLED = !!config.RECAPTCHA_SITE_KEY
const GITHUB_LINK = config.GITHUB_LINK

const ACTIVE_COLOR_SCHEME_KEY = getRandomColorScheme()

const method = ref('text')
const payload = ref('')
const recaptchaReady = ref(false)
const loading = ref(false)
const result = ref(null)
const error = ref(null)

const disabled = computed(() => {
  return (
    !payload.value ||
    loading.value ||
    (RECAPTCHA_ENABLED && !recaptchaReady.value)
  )
})

function switchMethod(m) {
  method.value = m
  payload.value = ''
}

function fetchQRCode(recaptchaToken = null) {
  const data = new URLSearchParams()
  data.append(method.value, payload.value)
  data.append('color_scheme', ACTIVE_COLOR_SCHEME_KEY)

  if (recaptchaToken) {
    data.append('recaptcha', recaptchaToken)
  }

  axios
    .post(QRCODE_SERVICE, data, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      if (response.status === 200) {
        result.value = `data:${
          response.headers['content-type']
        };base64,${btoa(
          String.fromCharCode.apply(null, new Uint8Array(response.data))
        )}`
      }
      loading.value = false
    })
    .catch(err => {
      loading.value = false
      if (err.response) {
        let errorData = {}
        try {
          errorData = JSON.parse(
            String.fromCharCode.apply(
              null,
              new Uint8Array(err.response.data)
            )
          )
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e
          }
        }

        if (err.response.status === 400 && errorData.description) {
          error.value = errorData.description
        } else {
          error.value = 'Oops! Something went wrong.'
        }
      } else {
        error.value = 'Oops! Something went wrong.'
      }

      Sentry.captureMessage('Failed to generate barcode', {
        level: 'warning',
        extra: {
          error: err,
          response: err.response,
          data,
          description: error.value
        }
      })
    })
}

function handleSubmit() {
  result.value = null
  error.value = null
  loading.value = true

  if (RECAPTCHA_ENABLED) {
    window.grecaptcha
      .execute(config.RECAPTCHA_SITE_KEY, {action: 'homepage'})
      .then(
        token => {
          fetchQRCode(token)
        },
        err => {
          loading.value = false
          error.value = 'Oops! Could not verify you are not a robot.'

          Sentry.captureMessage(
            'Failed to verify recaptcha on client-side',
            {
              level: 'warning',
              extra: {error: err}
            }
          )
        }
      )
  } else {
    fetchQRCode()
  }
}

onMounted(() => {
  applyColorScheme(ACTIVE_COLOR_SCHEME_KEY)

  if (RECAPTCHA_ENABLED) {
    const recaptchaScript = document.createElement('script')
    recaptchaScript.onload = () => {
      window.grecaptcha.ready(() => {
        recaptchaReady.value = true
      })
    }
    recaptchaScript.setAttribute(
      'src',
      `https://www.google.com/recaptcha/api.js?render=${config.RECAPTCHA_SITE_KEY}`
    )
    document.body.appendChild(recaptchaScript)
  }
})
</script>
