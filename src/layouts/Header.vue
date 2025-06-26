<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-200 text-gray-900 px-6 py-4 shadow-sm flex justify-between items-center">
    <router-link
      to="/"
      class="flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent hover:border-gold/50 hover:bg-gold/5 transition-colors"
    >
      <img src="/logo.png" alt="Logo" class="h-8 w-auto" />
      <span class="font-bold text-lg text-gold">Magikey</span>
    </router-link>

    <!-- Navigationsleiste aktuell leer, Hilfelink befindet sich im Overlay-Menü -->
    <nav class="hidden md:flex items-center gap-6 text-sm font-medium"></nav>

    <div class="flex items-center gap-3">
      <template v-if="!companyData">
        <router-link to="/register" class="btn-outline hidden md:inline-flex items-center">
          <i class="fa fa-key mr-2 animate-bounce"></i>
          Werde Problemsolver:in
        </router-link>
      </template>

      <button class="text-xl hover:text-gold" aria-label="Sprache">
        <i class="fa fa-globe"></i>
      </button>

      <template v-if="companyData">
        <router-link to="/dashboard" class="flex items-center gap-2 hover:underline">
          <img :src="companyData.logo_url || '/logo.png'" alt="Logo" class="w-9 h-9 rounded-full object-cover" />
          <span class="font-medium">{{ companyData.company_name }}</span>
        </router-link>
        <div class="relative">
          <button @click="toggleMenu" class="text-xl">⋮</button>
          <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow z-50">
            <button @click="goToEdit" class="block px-4 py-2 w-full text-left hover:bg-gray-100">Profil bearbeiten</button>
            <button @click="logout" class="block px-4 py-2 w-full text-left hover:bg-gray-100">Abmelden</button>
          </div>
        </div>
      </template>

      <template v-else>
        <button @click="showLogin = true" class="btn-outline">Einloggen</button>
      </template>

      <button @click="showOverlay = true" class="text-xl hover:text-gold" aria-label="Menü">
        <i class="fa fa-bars"></i>
      </button>
    </div>

    <teleport to="body">
      <LoginModal v-if="showLogin" @close="showLogin = false" />
      <OverlayMenu v-model="showOverlay" />
    </teleport>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebase'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import LoginModal from '@/components/company/LoginModal.vue'
import OverlayMenu from '@/components/common/OverlayMenu.vue'

const db = getFirestore()
const router = useRouter()
const showLogin = ref(false)
const showMenu = ref(false)
const showOverlay = ref(false)
const companyData = ref(null)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

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

onMounted(() => {
  fetchCompanyData(auth.currentUser)
  onAuthStateChanged(auth, fetchCompanyData)
})
</script>
