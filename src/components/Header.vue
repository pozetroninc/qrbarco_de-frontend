<template>
  <section :class="['hero', activeColorScheme?`is-${activeColorScheme}-primary`:'is-primary']">
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
            <li :class="{'text': true, 'is-active': activeMethod=='text'}"><a @click.prevent="handleMethodChange('text')">From&nbsp;<strong>Text</strong></a></li>
            <li :class="{'base64': true, 'is-active': activeMethod=='base64'}"><a @click.prevent="handleMethodChange('base64')">From&nbsp;<strong>Base64</strong></a></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import sassConfig from './../../app.sass.config.json'

export default {
  name: 'app-header',
  props: {
    activeColorScheme: {
      type: String,
      validator: function(value) {
        return value
          ? Object.keys(sassConfig.COLOR_SCHEMES).indexOf(value) !== -1
          : true
      }
    },
    activeMethod: {
      type: String,
      required: true,
      validator: function(value) {
        return ['text', 'base64'].indexOf(value) !== -1
      }
    },
    handleMethodChange: {
      type: Function,
      required: true
    }
  }
}
</script>
