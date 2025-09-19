<!-- Diese Datei zeigt die Lottie-Animation als Ladeanzeige. -->
<template>
  <lottie-player
    src="/lotties/loader.json"
    background="transparent"
    speed="1"
    :style="style"
    loop
    autoplay
  ></lottie-player>
</template>

<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 100
  }
})

const style = `width: ${props.size}px; height: ${props.size}px;`
</script>
