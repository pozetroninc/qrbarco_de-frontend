<template>
  <div id="app">

    <section class="hero is-primary">

      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Barcode Generator
          </h1>
          <p class="subtitle">
            Generate Barcodes (currently QR codes) from <strong>Text</strong> or <strong>Base64</strong> payloads!
          </p>
        </div>
      </div>

      <div class="hero-foot">
        <nav class="tabs is-boxed">
          <div class="container">
            <ul>
              <li :class="{'is-active': method=='text'}"><a @click.prevent="method='text'">From&nbsp;<strong>Text</strong></a></li>
              <li :class="{'is-active': method=='base64'}"><a @click.prevent="method='base64'">From&nbsp;<strong>Base64</strong></a></li>
            </ul>
          </div>
        </nav>
      </div>
    </section>

    <section class="section">
      <div class="container">

        <div class="columns">

          <div class="column is-two-thirds">
            <form id="payload-form" @submit.prevent="onSubmit">
              <textarea class="textarea" v-if="method == 'text'" v-model="text" placeholder="Insert text payload.."></textarea>
              <textarea class="textarea" v-else-if="method == 'base64'" v-model="base64" placeholder="Insert base64 payload.."></textarea>
              <br/>
              <button :class="{'button is-primary is-large full-width': true, 'is-loading': loading}" :disabled="disabled">
                <span class="icon is-small">
                  <i class="fas fa-qrcode"></i>
                </span>
                <span>Generate</span>
              </button>
            </form>
          </div>

          <div class="column">
            <div id='result' class="notification" v-if="result != null">
              <img :src="result" />
              <br/>
              <a class="button is-primary" :href="result" download="qrcode.png">
                <span class="icon is-small">
                  <i class="fas fa-download"></i>
                </span>
                <span>Download</span>
              </a>
            </div>
            <div id="error" class="notification is-danger" v-if="error != null">
              <button class="delete" @click.prevent="error=null"></button>
              {{error}}
            </div>
          </div>

        </div>

      </div>
    </section>

  </div>
</template>

<script>
import {Configs} from './configs.js'

let QRCODE_SERVICE = (process.env.NODE_ENV === 'development' ? Configs.DEV_QRCODE_SERVICE : Configs.PROD_QRCODE_SERVICE)

export default {
  name: 'app',
  data () {
    return {
      method: 'text', // 'text' | 'base64'
      text: '',
      base64: '',
      recaptcha_ready: false,
      loading: false,
      result: null,
      error: null
    }
  },
  computed: {
    disabled: function () {
      return !this.$data[this.$data.method] || this.$data.loading || !this.$data.recaptcha_ready;
    }
  },
  mounted: function () {
    grecaptcha.ready(() => {
      this.$data.recaptcha_ready = true
    })
  },
  methods: {

    onSubmit() {

      this.$data.result = null
      this.$data.error = null
      this.$data.loading = true

      grecaptcha.execute(Configs.RECAPTCHA_SITE_KEY, {action: 'homepage'}).then((token) => {
        let data = {}
        data[this.$data.method] = this.$data[this.$data.method]
        data['recaptcha'] = token

        this.$http.post(QRCODE_SERVICE, data, { emulateJSON: true, responseType: 'arraybuffer' }).then(function(res){
          if (res.status == 200) {
            this.$data.result = `data:${res.headers.get('content-type')};base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(res.data)))}`
          }
          this.$data.loading = false
        }, function(err) {
          if (err.status == 400 && err.body.description) {
            this.$data.error = err.body.description
          } else {
            this.$data.error = 'Oops! Something went wrong.'
          }
          this.$data.loading = false
        });
      }, (error) => {
        this.$data.error = 'Oops! Could not verify you are not a robot.'
        this.$data.loading = false
      })

    }
  }
}
</script>

<style>
  #result {
    text-align: center;
  }
  #error {
    background-color: #dd0000;
  }
  .full-width{
    width: 100%;
  }
</style>
