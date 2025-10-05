<template>
  <div
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur supports-[backdrop-filter]:backdrop-blur-xl"
  >
    <div v-if="showHeader" class="flex items-start gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
      <div v-if="$slots.icon" class="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
        <slot name="icon" />
      </div>
      <div class="min-w-0">
        <h3 v-if="title" class="text-sm font-semibold text-slate-800">
          {{ title }}
        </h3>
        <p v-if="description" class="mt-0.5 text-xs text-slate-500">
          {{ description }}
        </p>
      </div>
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="hasFooter" class="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  bodyClass: {
    type: String,
    default: 'space-y-4'
  },
  padded: {
    type: Boolean,
    default: true
  }
})

const slots = useSlots()

const showHeader = computed(() => Boolean(props.title || props.description || slots.icon))
const hasFooter = computed(() => Boolean(slots.footer))
const bodyClasses = computed(() => {
  const classes = []
  if (props.padded) {
    classes.push('px-4 py-4')
  }
  if (props.bodyClass) {
    classes.push(props.bodyClass)
  }
  return classes.join(' ')
})
</script>
