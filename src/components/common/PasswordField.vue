<template>
  <div>
    <FormKit
      type="password"
      :name="name"
      :label="label"
      validation="required|min:8"
      :placeholder="placeholder"
      :classes="inputClasses"
      :autocomplete="autocomplete"
      v-model="innerValue"
    />
    <div v-if="innerValue" :class="['text-sm mt-1', strengthClass]">
      Passwortstärke: {{ strengthText }}
    </div>
    <button
      type="button"
      class="text-xs text-gold underline mt-1"
      @click="generate"
    >
      Passwort generieren
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  name: { type: String, default: 'password' },
  label: { type: String, default: 'Passwort' },
  placeholder: { type: String, default: 'Mind. 8 Zeichen' },
  modelValue: { type: String, default: '' },
  autocomplete: { type: String, default: 'new-password' }
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref(props.modelValue)
watch(innerValue, (val) => emit('update:modelValue', val))

const inputClasses = {
  label: 'block text-sm font-medium mb-1',
  input: 'w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-gold focus:border-gold'
}

function generate() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?'
  let pwd = ''
  for (let i = 0; i < 12; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)]
  }
  innerValue.value = pwd
}

const strength = computed(() => {
  const v = innerValue.value || ''
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return score
})

const strengthText = computed(() => {
  const s = strength.value
  if (s <= 1) return 'Schwach'
  if (s === 2 || s === 3) return 'Mittel'
  return 'Stark'
})

const strengthClass = computed(() => {
  const s = strength.value
  if (s <= 1) return 'text-red-500'
  if (s === 2 || s === 3) return 'text-yellow-500'
  return 'text-green-500'
})
</script>

