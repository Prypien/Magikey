<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50" @click.self="close">
      <transition name="slide-fade">
        <nav v-if="modelValue" class="bg-white text-black w-72 max-w-full h-full p-6 rounded-l-3xl shadow-lg overflow-y-auto relative">
          <button class="absolute top-4 right-4 text-2xl" @click="close">&times;</button>
          <ul class="mt-8 space-y-4">
            <li><router-link to="/hilfe" class="hover:text-gold">❓ Hilfe-Center</router-link></li>
            <li><router-link to="/register" class="hover:text-gold">🛠️ Werde Problemsolver:in</router-link></li>
            <li><router-link to="/" class="hover:text-gold">👥 Partner:in finden</router-link></li>
            <li><router-link to="/login" class="hover:text-gold">🔐 Einloggen oder registrieren</router-link></li>
          </ul>
        </nav>
      </transition>
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

watch(() => props.modelValue, (val) => {
  if (val) {
    document.addEventListener('keydown', handleKey)
  } else {
    document.removeEventListener('keydown', handleKey)
  }
})
</script>

<style scoped>
nav a {
  @apply block font-medium rounded-md px-3 py-2 transition-colors;
}
nav a:hover {
  @apply bg-gold/10;
}
</style>
