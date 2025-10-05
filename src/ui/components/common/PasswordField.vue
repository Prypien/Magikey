<!-- Diese Datei baut ein Passwortfeld mit Stärkeanzeige auf. -->
<template>
  <div>
    <FormKit
      type="password"
      :name="name"
      :label="label"
      validation="required|length:6,255"
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
import { evaluatePasswordStrength } from '@/core/utils/passwordStrength'

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
  classes: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref(props.modelValue)
watch(innerValue, (val) => emit('update:modelValue', val))

const baseClasses = {
  outer: 'space-y-2',
  label: 'label text-slate-700',
  input: 'water-input',
  help: 'text-xs text-slate-500',
}

const inputClasses = computed(() => ({ ...baseClasses, ...props.classes }))

const strength = computed(() => evaluatePasswordStrength(innerValue.value))

const strengthPercent = computed(() => strength.value.percent)

const strengthText = computed(() => strength.value.label)

const strengthClass = computed(() => strength.value.textClass)

const barClass = computed(() => strength.value.barClass)
</script>

