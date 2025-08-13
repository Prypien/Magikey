<template>
  <!-- Fester Seitenkopf mit Logo, Navigation und Menübutton -->
  <header
    ref="headerRef"
    class="fixed top-0 left-0 w-full z-50 bg-gray-100/90 backdrop-blur border-b border-gray-200 text-gray-900 px-6 py-4 shadow-sm flex items-center justify-between relative transition-all duration-200"
    :class="{ 'py-6': searchActive }"
  >
      <router-link
        to="/"
        class="flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent hover:border-gold/50 hover:bg-gold/5 transition-colors"
        v-show="!hideNavOnHomeMobile"
      >
      <img src="/logo.png" alt="Logo" class="h-12 w-auto" />
      <span class="font-bold text-xl text-gold">Magikey</span>
    </router-link>

    <nav class="hidden md:flex items-center gap-6 text-sm font-medium"></nav>

    <div class="flex-1 flex justify-center px-4" v-if="showFilterBar">
      <MobileFilterBar v-if="isMobile" />
      <transition name="slide-down">
        <FilterBar
          v-show="!isMobile"
          class="w-full max-w-2xl"
          :expanded="searchActive"
          @focus="searchActive = true"
          @blur="searchActive = false"
        />
      </transition>
    </div>

    <div class="flex items-center gap-3">
      <!-- Link zum Dashboard wenn Firma eingeloggt ist -->
      <router-link v-if="companyData" to="/dashboard" class="flex items-center gap-2 hover:underline" v-show="!hideNavOnHomeMobile">
        <img :src="companyData.logo_url || '/logo.png'" alt="Logo" class="w-9 h-9 rounded-full object-cover" />
        <span class="font-medium">{{ companyData.company_name }}</span>
      </router-link>

      <template v-if="!companyData">
        <router-link to="/onboarding" class="btn-outline hidden md:inline-flex items-center" v-show="!hideNavOnHomeMobile">
          <i class="fa fa-key mr-2 animate-bounce"></i>
          Werde Problemsolver:in
        </router-link>
      </template>

      <!-- Button zum Öffnen des mobilen Overlays -->
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
// Reaktives State-Management und Lifecycle-Hooks
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// Firebase-Dienste
import { auth } from '@/firebase'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
// Overlay-Menü-Komponente
import OverlayMenu from '@/components/common/OverlayMenu.vue'
import FilterBar from '@/components/user/FilterBar.vue'
import MobileFilterBar from '@/components/user/MobileFilterBar.vue'

const emit = defineEmits(['update-height'])

const db = getFirestore()
const router = useRouter()
const route = useRoute()

const showFilterBar = computed(() => route.name === 'home')
const isMobile = ref(false)
const hideNavOnHomeMobile = computed(() => isMobile.value && route.name === 'home')
// steuert die Sichtbarkeit des Menüs
const showOverlay = ref(false)
// Daten des eingelog gten Unternehmens
const companyData = ref(null)
// Referenz auf den Menü-Button für Click-Outside-Handling
const menuButton = ref(null)
// Referenz auf den Header für dynamische Höhe
const headerRef = ref(null)
// zeigt an, ob die Suchleiste aktiv ist
const searchActive = ref(false)
let resizeObserver = null
// zeigt, ob die Ansicht mobil ist
// Menü ein- oder ausblenden
function toggleOverlay() {
  showOverlay.value = !showOverlay.value
}


// schließt das Overlay, wenn außerhalb geklickt wird
function handleClickOutside(event) {
  if (showOverlay.value && !menuButton.value.contains(event.target)) {
    showOverlay.value = false
  }
}

// reduziert die Größe von Header und Suche beim Scrollen
function handleScroll() {
  if (searchActive.value && window.scrollY > 0) {
    searchActive.value = false
  }
}

function updateMobile() {
  isMobile.value = window.innerWidth < 640
}

// Listener registrieren und Initialdaten laden
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', updateMobile)
  updateMobile()
  fetchCompanyData(auth.currentUser)
  onAuthStateChanged(auth, fetchCompanyData)
  if (headerRef.value) {
    emit('update-height', headerRef.value.offsetHeight)
    resizeObserver = new window.ResizeObserver((entries) => {
      emit('update-height', entries[0].contentRect.height)
    })
    resizeObserver.observe(headerRef.value)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateMobile)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// Lädt die Unternehmensdaten des eingeloggten Users
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

// Ausloggen des Users und Redirect
async function logout() {
  await signOut(auth)
  router.push('/')
}
</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
</style>
