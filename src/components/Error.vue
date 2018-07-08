<template>
  <div id="error" class="notification is-danger">
    <button class="delete" @click.prevent="$emit('close')"></button>
    {{error}}
  </div>
</template>

<script>
export default {
  name: 'app-error',
  props: {
    error: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
#error {
  background-color: #dd0000;
}
</style>
