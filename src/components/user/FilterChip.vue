<template>
  <button
    class="flex items-center gap-1 px-4 py-2 rounded-2xl border transition font-medium"
    :class="active ? 'border-gold bg-gold/10 text-gold' : 'border-gray-200 bg-white text-gray-700'"
    @click="$emit('click')"
  >
    <component :is="icon" class="w-5 h-5 mr-1" />
    <span>{{ label }}</span>
    <ChevronDown v-if="showChevron" class="w-4 h-4 ml-1" />
  </button>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'

defineProps({
  icon: { type: [String, Object], required: true },
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  showChevron: { type: Boolean, default: false }
})
</script>
