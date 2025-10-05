<!-- Diese Datei präsentiert eine Erfolgsmeldung nach Aktionen. -->
<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-2xl">
      <div class="glass-card p-8 sm:p-10 text-center">
        <div class="flex flex-col items-center gap-4">
          <lottie-player
            src="/lotties/haken.json"
            background="transparent"
            speed="1"
            style="width: 200px; height: 200px;"
            autoplay
          ></lottie-player>
          <h1 class="section-heading">{{ message }}</h1>
          <p class="section-subtitle">Alles erledigt – du kannst mit dem nächsten Schritt fortfahren.</p>
          <button class="btn" @click="goNext">Weiter</button>
        </div>
      </div>
    </div>
  </section>
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
