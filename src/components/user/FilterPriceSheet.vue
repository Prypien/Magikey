<!-- Diese Datei zeigt ein Overlay, um den Preisbereich einzustellen. -->
<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="fixed inset-0 bg-black/50 z-40 flex items-end sm:items-center justify-center">
        <div class="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Preis</h3>
            <button @click="close" class="text-gray-500 hover:text-black">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between text-sm">
              <span>{{ range[0] }} €</span>
              <span>{{ range[1] }} €</span>
            </div>
            <input type="range" v-model.number="range[0]" :max="max" :min="min" step="1" class="w-full" />
            <input type="range" v-model.number="range[1]" :max="max" :min="min" step="1" class="w-full" />
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
import { DEFAULT_PRICE_RANGE } from '@/stores/filters'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [...DEFAULT_PRICE_RANGE]
  },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 1000 },
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'close'])

function toRangeArray(value) {
  if (Array.isArray(value) && value.length === 2) {
    return [...value]
  }
  return [...DEFAULT_PRICE_RANGE]
}

const range = ref(toRangeArray(props.modelValue))

watch(
  () => props.modelValue,
  (val) => {
    range.value = toRangeArray(val)
  }
)

function apply() {
  emit('update:modelValue', range.value)
  close()
}

function close() {
  emit('close')
}
</script>
