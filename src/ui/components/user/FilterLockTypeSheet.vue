<!-- Diese Datei öffnet ein Overlay zur Auswahl der Schlosstypen. -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="fixed inset-0 bg-black/50 z-40 flex items-end sm:items-center justify-center">
        <div class="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Schlosstypen</h3>
            <button @click="close" class="text-gray-500 hover:text-black">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="space-y-2 max-h-60 overflow-auto">
            <label v-for="opt in options" :key="opt.value" class="flex items-center gap-3 text-sm">
              <input type="checkbox" :value="opt.value" v-model="selected" class="accent-gold" />
              <span class="flex items-center gap-2">
                <span aria-hidden="true">{{ opt.icon }}</span>
                <span>{{ opt.label }}</span>
              </span>
            </label>
          </div>
          <div class="text-right mt-4">
            <button class="btn px-4 py-2" @click="apply">Übernehmen</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { LOCK_TYPE_OPTIONS } from '@/core/constants/lockTypes'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'close'])

const options = LOCK_TYPE_OPTIONS
const selected = ref([...props.modelValue])

watch(() => props.modelValue, (val) => {
  selected.value = [...val]
})

function apply() {
  emit('update:modelValue', selected.value)
  close()
}

function close() {
  emit('close')
}
</script>
