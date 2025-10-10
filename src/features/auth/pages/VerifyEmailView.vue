<!-- Diese Datei verarbeitet den Bestätigungslink aus der E-Mail. -->
<template>
  <section class="page-wrapper">
    <div class="mx-auto max-w-2xl">
      <div class="glass-card p-8 sm:p-10 text-center">
        <template v-if="loading">
          <div class="flex flex-col items-center gap-3 text-slate-500">
            <Loader :size="80" />
            <p>Überprüfe Link…</p>
          </div>
        </template>
        <template v-else-if="success">
          <div class="flex flex-col items-center gap-4">
            <lottie-player
              src="/lotties/haken.json"
              background="transparent"
              speed="1"
              style="width: 200px; height: 200px;"
              autoplay
            ></lottie-player>
            <h1 class="section-heading">E-Mail bestätigt</h1>
            <p class="section-subtitle">
              Vielen Dank! Deine E-Mail-Adresse wurde erfolgreich bestätigt. Unser Trust-Team prüft jetzt deine Unternehmensdaten.
              Du kannst dich im Partnerbereich anmelden, um den aktuellen Status einzusehen.
            </p>
            <button class="btn" @click="gotoLogin">Zum Partner-Login</button>
          </div>
        </template>
        <p v-else class="text-red-600">Link ist ungültig oder abgelaufen.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, db, isFirebaseConfigured } from '@/core/firebase'
import { applyActionCode, checkActionCode } from 'firebase/auth'
import { updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { ROUTE_LOCATIONS } from '@/core/constants/routes'
import Loader from '@/ui/components/common/Loader.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const success = ref(false)

onMounted(async () => {
  if (!isFirebaseConfigured || !auth || !db) {
    loading.value = false
    return
  }
  const code = route.query.oobCode
  if (!code) {
    loading.value = false
    return
  }
  try {
    const info = await checkActionCode(auth, code)
    await applyActionCode(auth, code)
    const email = info?.data?.email
    // Reload the current user so emailVerified is updated locally
    if (auth.currentUser && auth.currentUser.email === email) {
      await auth.currentUser.reload()
    }
    if (email) {
      const q = query(collection(db, 'companies'), where('email', '==', email))
      const snap = await getDocs(q)

      const updatePromises = snap.docs.map((docSnap) => {
        const data = typeof docSnap.data === 'function' ? docSnap.data() : {}
        const currentStatus = data?.verification?.status

        const updatePayload = {
          email_verified: true,
          email_verified_at: serverTimestamp(),
        }

        updatePayload['verification.last_update'] = serverTimestamp()

        if (!currentStatus || currentStatus === 'pending') {
          updatePayload['verification.status'] = 'in_review'
        }

        return updateDoc(docSnap.ref, updatePayload)
      })

      if (updatePromises.length) {
        const results = await Promise.allSettled(updatePromises)
        results
          .filter((result) => result.status === 'rejected')
          .forEach((result) => {
            console.error('Konnte E-Mail-Verifizierungsstatus nicht aktualisieren', result.reason)
          })
      }
    }
    success.value = true
  } catch (err) {
    console.error('Verifizierung fehlgeschlagen', err)
  } finally {
    loading.value = false
  }
})

function gotoLogin() {
  router.push(ROUTE_LOCATIONS.LOGIN)
}
</script>

