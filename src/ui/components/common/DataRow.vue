<!-- Diese Datei zeigt ein kleines Zeilenpaar aus Bezeichnung und Wert an. -->
<template>
  <div class="flex items-start justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-inner">
    <span class="font-medium text-slate-800">{{ label }}:</span>
    <span class="text-slate-600">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
})
</script>
