<!-- Diese Datei baut ein Passwortfeld mit Stärkeanzeige auf. -->
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
      inputmode="text"
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
import { evaluatePasswordStrength } from '@/utils/passwordStrength'

const props = defineProps({
  name: { type: String, default: 'password' },
  label: { type: String, default: 'Passwort' },
  placeholder: { type: String, default: 'Mind. 6 Zeichen' },
  help: {
    type: String,
    default:
      'Mindestens 6 Zeichen. Verwende nach Möglichkeit Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.',
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

const strength = computed(() => evaluatePasswordStrength(innerValue.value))

const strengthPercent = computed(() => strength.value.percent)

const strengthText = computed(() => strength.value.label)

const strengthClass = computed(() => strength.value.textClass)

const barClass = computed(() => strength.value.barClass)
</script>

