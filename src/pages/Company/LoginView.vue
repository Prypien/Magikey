<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow">
    <h1 class="text-2xl font-semibold mb-6 text-center text-black">Login für Unternehmen</h1>
    <button
      @click="loginWithGoogleAccount"
      class="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold mb-2"
      aria-label="Mit Google anmelden"
    >
      <svg class="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#4285F4"
          d="M533.5 278.4c0-17.7-1.4-35-4-51.8H272v98h147.5c-6.4 34.4-25.7 63.5-54.8 83.1v68h88.5c51.6-47.5 80.8-117.5 80.8-197.3z"
        />
        <path
          fill="#34A853"
          d="M272 544.3c73.7 0 135.6-24.5 180.8-66.5l-88.5-68c-24.7 16.6-56.5 26-92.3 26-70.9 0-131-47.9-152.5-112.5H28.9v70.9C73.6 473 167.6 544.3 272 544.3z"
        />
        <path
          fill="#FBBC05"
          d="M119.5 323.3c-11.4-34-11.4-70.6 0-104.5V148H28.9c-47.6 95.6-47.6 208.5 0 304.1l90.6-70.8z"
        />
        <path
          fill="#EA4335"
          d="M272 107.7c39.9 0 75.7 13.8 104.1 40.8l78.2-78.2C407.5 23.8 344.7 0 272 0 167.6 0 73.6 71.3 28.9 176l90.6 70.8C141 155.6 201.1 107.7 272 107.7z"
        />
      </svg>
      <span class="text-gray-700 font-medium">Mit Google anmelden</span>
    </button>
    <p v-if="googleError" class="text-red-600 text-sm text-center mt-2">{{ googleError }}</p>
    <p v-if="googleLoading" class="text-gray-600 text-sm text-center mt-2">Lade...</p>
    <div class="text-center text-gray-400 mb-6">oder mit E-Mail einloggen</div>
    <Login />
  </div>
</template>

<script setup>
import Login from '@/components/company/Login.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { loginWithGoogle } from '@/services/auth'

const router = useRouter()
const googleLoading = ref(false)
const googleError = ref('')

const loginWithGoogleAccount = async () => {
  googleError.value = ''
  googleLoading.value = true
  try {
    const { user } = await loginWithGoogle()
    const docRef = doc(db, 'companies', user.uid)
    const snap = await getDoc(docRef)
    let data
    if (!snap.exists()) {
      data = {
        email: user.email || '',
        company_name: user.displayName || '',
        created_at: new Date().toISOString(),
      }
      await setDoc(docRef, data)
    } else {
      data = snap.data()
    }
    router.push(!data.company_name ? '/edit' : '/dashboard')
  } catch (e) {
    googleError.value = e.message
  } finally {
    googleLoading.value = false
  }
}
</script>
