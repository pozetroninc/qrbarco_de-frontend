<template>
  <form id="payload-form" @submit.prevent="emit('submit')">
    <textarea
      class="textarea"
      :value="payload"
      @input="emit('payload-input', $event)"
      :placeholder="`Insert ${activeMethod === 'text' ? 'text ' : (activeMethod === 'base64' ? 'base64 ' : '')}payload..`"
    ></textarea>
    <br/>
    <button
      :class="['button', 'is-large', 'full-width', 'is-scheme-secondary-1', {'is-loading': loading}]"
      :disabled="disabled"
    >
      <span class="icon is-small">
        <i class="fas fa-qrcode"></i>
      </span>
      <span>Generate</span>
    </button>
  </form>
</template>

<script setup>
defineProps({
  payload: {
    type: String
  },
  activeMethod: {
    type: String,
    required: true,
    validator: (value) => ['text', 'base64'].includes(value)
  },
  loading: {
    type: Boolean,
    required: true
  },
  disabled: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['submit', 'payload-input'])
</script>

<style>
.full-width {
  width: 100%;
}
</style>
