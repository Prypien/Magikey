<template>
  <button
    class="flex items-center gap-1 px-4 py-2 rounded-2xl font-medium transition shadow border select-none"
    :class="active ? 'border-gold bg-gold/10 text-gold' : 'border-gray-200 bg-white text-gray-700 hover:bg-gold/5'"
    @click="$emit('click')"
  >
    <component :is="iconComp" class="w-5 h-5 mr-1" />
    <span>{{ label }}</span>
    <ChevronDown v-if="label === 'Preis'" class="w-4 h-4 ml-1" />
  </button>
</template>

<script setup>
import { Clock, Euro, ChevronDown } from 'lucide-vue-next'

const icons = { Clock, Euro }
const props = defineProps(['icon', 'label', 'active'])
const iconComp = icons[props.icon]
</script>
