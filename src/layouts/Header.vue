<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-200 text-gray-900 px-6 py-4 shadow-sm flex justify-between items-center relative">
    <router-link
      to="/"
      class="flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent hover:border-gold/50 hover:bg-gold/5 transition-colors"
    >
      <img src="/logo.png" alt="Logo" class="h-8 w-auto" />
      <span class="font-bold text-lg text-gold">Magikey</span>
    </router-link>

    <nav class="hidden md:flex items-center gap-6 text-sm font-medium"></nav>

    <div class="flex items-center gap-3">
      <router-link v-if="companyData" to="/dashboard" class="flex items-center gap-2 hover:underline">
        <img :src="companyData.logo_url || '/logo.png'" alt="Logo" class="w-9 h-9 rounded-full object-cover" />
        <span class="font-medium">{{ companyData.company_name }}</span>
      </router-link>

      <template v-if="!companyData">
        <router-link to="/register" class="btn-outline hidden md:inline-flex items-center">
          <i class="fa fa-key mr-2 animate-bounce"></i>
          Werde Problemsolver:in
        </router-link>
      </template>

      <button class="text-xl hover:text-gold focus:outline-none" aria-label="Sprache">
        <i class="fa fa-globe"></i>
      </button>

      <button
        @click="toggleOverlay"
        class="text-xl hover:text-gold transition-colors focus:outline-none"
        :class="{ 'rotate-90': showOverlay }"
        aria-label="Menü"
        ref="menuButton"
      >
        <i class="fa fa-bars"></i>
      </button>
    </div>

    <teleport to="body">
      <OverlayMenu v-model="showOverlay" :companyData="companyData" @logout="logout" />
    </teleport>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import OverlayMenu from '@/components/common/OverlayMenu.vue'

const db = getFirestore()
const router = useRouter()
const showMenu = ref(false)
const showOverlay = ref(false)
const companyData = ref(null)
const menuButton = ref(null)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function toggleOverlay() {
  showOverlay.value = !showOverlay.value
}

function handleClickOutside(event) {
  if (showOverlay.value && !menuButton.value.contains(event.target)) {
    showOverlay.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchCompanyData(auth.currentUser)
  onAuthStateChanged(auth, fetchCompanyData)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

async function fetchCompanyData(user) {
  if (!user) {
    companyData.value = null
    return
  }
  const docRef = doc(db, 'companies', user.uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    companyData.value = docSnap.data()
  } else {
    companyData.value = null
  }
}

function goToEdit() {
  router.push('/edit')
}

async function logout() {
  await auth.signOut()
  router.push('/')
}
</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}
</style>
