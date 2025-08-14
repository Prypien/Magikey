<template>
  <div>
    <FormKit
      type="password"
      :name="name"
      :label="label"
      validation="required|min:6"
      :placeholder="placeholder"
      :help="help"
      :classes="inputClasses"
      :autocomplete="autocomplete"
      v-model="innerValue"
    />
    <div v-if="innerValue" class="mt-1">
      <div class="h-2 w-full bg-gray-200 rounded">
        <div
          class="h-full rounded transition-all"
          :class="barClass"
          :style="{ width: strengthPercent + '%' }"
        ></div>
      </div>
      <div :class="['text-sm mt-1', strengthClass]">
        Passwortstärke: {{ strengthText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  name: { type: String, default: 'password' },
  label: { type: String, default: 'Passwort' },
  placeholder: { type: String, default: 'Mind. 6 Zeichen' },
  help: {
    type: String,
    default:
      'Mindestens 6 Zeichen, Groß- und Kleinbuchstaben, Zahl und Sonderzeichen',
  },
  modelValue: { type: String, default: '' },
  autocomplete: { type: String, default: 'new-password' },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref(props.modelValue)
watch(innerValue, (val) => emit('update:modelValue', val))

const inputClasses = {
  label: 'block text-sm font-medium mb-1',
  input: 'w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-gold focus:border-gold',
}

const strength = computed(() => {
  const v = innerValue.value || ''
  let score = 0
  if (v.length >= 6) score++
  if (/[A-Z]/.test(v)) score++
  if (/[a-z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return score
})

const strengthPercent = computed(() => (strength.value / 5) * 100)

const strengthText = computed(() => {
  const s = strength.value
  if (s <= 2) return 'Schwach'
  if (s <= 4) return 'Mittel'
  return 'Stark'
})

const strengthClass = computed(() => {
  const s = strength.value
  if (s <= 2) return 'text-red-500'
  if (s <= 4) return 'text-yellow-500'
  return 'text-green-500'
})

const barClass = computed(() => {
  const s = strength.value
  if (s <= 2) return 'bg-red-500'
  if (s <= 4) return 'bg-yellow-500'
  return 'bg-green-500'
})
</script>

