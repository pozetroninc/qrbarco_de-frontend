<template>
  <div id="result" class="notification">
    <img :src="result" />
    <br/>
    <a :class="['button', activeColorScheme?`is-${activeColorScheme}-secondary-2`:'is-primary']" :href="result" download="qrcode.png">
      <span class="icon is-small">
        <i class="fas fa-download"></i>
      </span>
      <span>Download</span>
    </a>
  </div>
</template>

<script>
import sassConfig from './../../app.sass.config.json'

export default {
  name: 'app-result',
  props: {
    activeColorScheme: {
      type: String,
      validator: function(value) {
        return value
          ? Object.keys(sassConfig.COLOR_SCHEMES).indexOf(value) !== -1
          : true
      }
    },
    result: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
#result {
  text-align: center;
}
</style>
