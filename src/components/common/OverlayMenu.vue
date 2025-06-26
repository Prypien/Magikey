<template>
  <transition name="grow-down">
    <div
      v-if="modelValue"
      class="absolute right-4 top-16 bg-white text-black w-72 max-w-full p-4 rounded-2xl shadow-xl z-50"
    >
      <ul class="space-y-3">
        <li>
          <router-link to="/hilfe" class="menu-link">Hilfe-Center</router-link>
        </li>
        <li>
          <router-link to="/register" class="menu-link">Problemsolver:in werden</router-link>
        </li>
        <li>
          <router-link to="/" class="menu-link">Schlosser finden</router-link>
        </li>
        <li>
          <router-link to="/login" class="menu-link">Einloggen</router-link>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

function handleKey(e) {
  if (e.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      document.addEventListener('keydown', handleKey)
    } else {
      document.removeEventListener('keydown', handleKey)
    }
  }
)
</script>

<style scoped>
/* Dropdown Grow-Down Animation */
.grow-down-enter-active,
.grow-down-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}
.grow-down-enter-from,
.grow-down-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}

/* Menülink-Styling */
.menu-link {
  @apply block font-medium rounded-lg px-4 py-2 transition-all;
}
.menu-link:hover {
  background-color: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.25);
  transform: scale(1.01);
}
</style>
