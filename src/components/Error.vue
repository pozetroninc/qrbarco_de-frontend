<template>
  <div id="error" class="notification is-danger">
    <button class="delete" @click.prevent="emit('close')"></button>
    {{ error }}
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])
</script>

<style>
#error {
  background-color: #dd0000;
}
</style>
