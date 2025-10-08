<template>
  <div class="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3 sm:right-6">
    <Transition name="bubble">
      <div
        v-if="open && hasOptions"
        class="flex flex-col items-stretch gap-2 rounded-3xl border border-white/70 bg-white/95 p-3 text-sm text-slate-600 shadow-xl backdrop-blur"
      >
        <p class="px-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Kontakt</p>
        <button
          v-if="phoneLabel"
          type="button"
          class="btn flex min-w-[12rem] items-center justify-center gap-2"
          @click="handleClick('call')"
        >
          <i class="fa fa-phone"></i>
          {{ phoneLabel }}
        </button>
        <button
          v-if="whatsappLabel"
          type="button"
          class="btn flex min-w-[12rem] items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600"
          @click="handleClick('whatsapp')"
        >
          <i class="fa fa-whatsapp"></i>
          {{ whatsappLabel }}
        </button>
      </div>
    </Transition>

    <button
      v-if="hasOptions"
      type="button"
      class="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white shadow-lg transition hover:bg-gold/90"
      @click="toggle"
    >
      <span
        class="absolute inset-0 -z-10 animate-ping rounded-full bg-gold/60 transition group-hover:animate-none"
        aria-hidden="true"
      ></span>
      <i class="fa" :class="open ? 'fa-times' : 'fa-comments'" aria-hidden="true"></i>
      <span class="sr-only">Kontaktoptionen anzeigen</span>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  phoneLabel: {
    type: String,
    default: '',
  },
  whatsappLabel: {
    type: String,
    default: '',
  },
  hasOptions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])

const open = ref(false)

const hasOptions = computed(() => props.hasOptions && (props.phoneLabel || props.whatsappLabel))

watch(
  hasOptions,
  (next) => {
    if (!next) {
      open.value = false
    }
  }
)

function toggle() {
  if (!hasOptions.value) return
  open.value = !open.value
}

function handleClick(action) {
  emit('select', action)
  open.value = false
}
</script>

<style scoped>
.bubble-enter-active,
.bubble-leave-active {
  transition: all 0.2s ease;
  transform-origin: bottom right;
}

.bubble-enter-from,
.bubble-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(10%);
}
</style>
