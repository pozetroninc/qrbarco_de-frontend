<template>
  <section class="hero is-scheme-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Barcode Generator
        </h1>
        <p class="subtitle">
          Generate 2D Barcodes (QR codes) from <strong>Text</strong> or <strong>Base64</strong>
        </p>
      </div>
    </div>
    <div class="hero-foot">
      <nav class="tabs is-boxed">
        <div class="container">
          <ul>
            <li :class="{'text': true, 'is-active': activeMethod === 'text', 'has-text-black': activeMethod === 'text'}">
              <a @click.prevent="emit('method-change', 'text')">From&nbsp;<strong>Text</strong></a>
            </li>
            <li :class="{'base64': true, 'is-active': activeMethod === 'base64', 'has-text-black': activeMethod === 'base64'}">
              <a @click.prevent="emit('method-change', 'base64')">From&nbsp;<strong>Base64</strong></a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>

<script setup>
defineProps({
  activeMethod: {
    type: String,
    required: true,
    validator: (value) => ['text', 'base64'].includes(value)
  }
})

const emit = defineEmits(['method-change'])
</script>
