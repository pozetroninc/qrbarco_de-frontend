<template>
  <div id="result" class="notification">
    <img :src="result" />
    <br/>
    <a class="button is-scheme-secondary-2" :href="result" download="qrcode.png">
      <span class="icon is-small">
        <i class="fas fa-download"></i>
      </span>
      <span>Download</span>
    </a>
  </div>
</template>

<script setup>
defineProps({
  result: {
    type: String,
    required: true
  }
})
</script>

<style>
#result {
  text-align: center;
}
</style>
