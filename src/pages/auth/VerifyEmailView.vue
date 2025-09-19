<template>
  <div class="flex flex-col items-center justify-center text-center min-h-[60vh] px-4">
    <template v-if="loading">
      <Loader :size="80" />
      <p class="mt-2">Überprüfe Link...</p>
    </template>
    <template v-else-if="success">
      <lottie-player
        src="/lotties/haken.json"
        background="transparent"
        speed="1"
        style="width: 200px; height: 200px;"
        autoplay
      ></lottie-player>
      <h1 class="text-2xl font-semibold text-black mt-4">E-Mail bestätigt</h1>
      <button class="btn mt-6" @click="gotoLogin">Weiter zum Login</button>
    </template>
    <p v-else class="text-red-600">Link ist ungültig oder abgelaufen.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { applyActionCode, checkActionCode } from 'firebase/auth'
import { updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import Loader from '@/components/common/Loader.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const success = ref(false)

onMounted(async () => {
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
      for (const docSnap of snap.docs) {
        await updateDoc(docSnap.ref, { verified: true })
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
  router.push('/login')
}
</script>

