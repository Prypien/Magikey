<template>
  <button
    class="btn"
    :class="sizeClass"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md'
  },
  disabled: Boolean
})

const sizeClass = computed(() =>
  props.size === 'sm'
    ? 'py-1 px-2 text-sm'
    : props.size === 'lg'
      ? 'py-3 px-6 text-lg'
      : 'py-2 px-4'
)
</script>

<style scoped>
.btn {
  @apply bg-gold text-black rounded-full font-medium shadow transition-colors duration-200 hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50;
}
</style>