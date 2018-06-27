<template>
  <form id="payload-form" @submit.prevent="handleSubmit">
    <textarea class="textarea" :value="payload" @input="$emit('payload-input', $event)" :placeholder="`Insert ${activeMethod == 'text'?'text ':(activeMethod == 'base64'?'base64 ':'')}payload..`"></textarea>
    <br/>
    <button :class="['button is-large full-width', activeColorScheme?`is-${activeColorScheme}-secondary-1`:'is-primary', {'is-loading': loading}]" :disabled="disabled">
      <span class="icon is-small">
        <i class="fas fa-qrcode"></i>
      </span>
      <span>Generate</span>
    </button>
  </form>
</template>

<script>
import sassConfig from './../../app.sass.config.json'

export default {
  name: 'app-form',
  props: {
    payload: {
      type: String
    },
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
    handleSubmit: {
      type: Function,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style>
.full-width {
  width: 100%;
}
</style>
