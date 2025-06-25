<template>
  <div class="flex justify-between border-b pb-1 text-sm">
    <span class="font-medium text-gray-800">{{ label }}:</span>
    <span class="text-gray-700">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
})
</script>
