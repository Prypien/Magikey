<!-- Dropdown-Menü für Navigation und Aktionen -->
<template>
  <transition name="overlay-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-start justify-end bg-black/30 px-4 pt-20 sm:bg-transparent sm:px-0 sm:pt-0"
      @click.self="close"
    >
      <transition name="grow-down">
        <div
          v-if="modelValue"
          class="menu-panel relative w-full max-w-sm rounded-3xl bg-white p-5 text-black shadow-2xl sm:mr-4 sm:w-72 sm:max-w-full sm:rounded-2xl sm:p-4"
          @click.stop
        >
          <ul class="space-y-3">
            <li>
              <router-link to="/hilfe" class="menu-link">Hilfe-Center</router-link>
            </li>
            <li v-if="!companyData">
              <router-link to="/register" class="menu-link">Problemsolver:in werden</router-link>
            </li>
            <li>
              <router-link to="/" class="menu-link">Schlosser finden</router-link>
            </li>
            <li v-if="!companyData">
              <router-link to="/login" class="menu-link">Einloggen</router-link>
            </li>
            <li v-if="companyData">
              <router-link to="/edit" class="menu-link">Profil bearbeiten</router-link>
            </li>
            <li v-if="companyData">
              <button @click="$emit('logout')" class="menu-link w-full text-left">Abmelden</button>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
// Props und Events definieren
import { watch, onBeforeUnmount, ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  companyData: Object
})
const emit = defineEmits(['update:modelValue', 'logout'])
// Menü schließen


function close() {
// ESC-Taste schließt das Menü
  emit('update:modelValue', false)
}

function handleKey(e) {
  if (e.key === 'Escape') close()
}

const previousBodyOverflow = ref('')

// Listener je nach Sichtbarkeit registrieren
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      document.addEventListener('keydown', handleKey)
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        previousBodyOverflow.value = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
    } else {
      document.removeEventListener('keydown', handleKey)
      if (typeof window !== 'undefined') {
        document.body.style.overflow = previousBodyOverflow.value
      }
    }
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKey)
  if (typeof window !== 'undefined') {
    document.body.style.overflow = previousBodyOverflow.value
  }
})
</script>

<style scoped>
/* Sanfte Einblendung der dunklen Fläche auf kleinen Bildschirmen */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

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
