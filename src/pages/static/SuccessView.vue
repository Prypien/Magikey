<!-- Diese Datei präsentiert eine Erfolgsmeldung nach Aktionen. -->
<template>
  <div class="flex flex-col items-center justify-center text-center min-h-[60vh] px-4">
    <lottie-player
      src="/lotties/haken.json"
      background="transparent"
      speed="1"
      style="width: 200px; height: 200px;"
      autoplay
    ></lottie-player>
    <h1 class="text-2xl font-semibold text-black mt-4">{{ message }}</h1>
    <button class="btn mt-6" @click="goNext">Weiter</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const message = route.query.msg || 'Alles gespeichert'
const next = route.query.next || '/dashboard'

function goNext() {
  router.push(next)
}
</script>
