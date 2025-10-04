<!-- Diese Datei baut den Kopfbereich mit Logo, Filter und Menü. -->
<template>
  <!-- Fester Seitenkopf mit Logo, Navigation und Menübutton -->
  <header
    ref="headerRef"
    class="header-shell"
    :class="{
      'header-search-active': searchActive,
      'header-compact': compactHeader,
    }"
  >
    <router-link
      to="/"
      class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full border border-transparent bg-white/40 transition-all hover:-translate-y-[1px] hover:border-gold/40 hover:shadow-sm whitespace-nowrap shrink-0"
      :class="compactHeader ? 'gap-1 px-1.5 py-1 max-w-[9rem]' : ''"
    >
      <img
        src="/logo.png"
        alt="Logo"
        class="w-auto transition-all duration-200"
        :class="compactHeader ? 'h-6' : 'h-8 sm:h-10 md:h-12'"
      />
      <span
        class="font-bold text-base sm:text-lg md:text-xl text-gold transition-all duration-200"
        :class="compactHeader ? 'text-sm truncate' : ''"
      >
        Magikey
      </span>
    </router-link>

    <nav class="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-slate-600">
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="rounded-full px-3 py-2 transition hover:text-slate-900 hover:bg-white/60"
      >
        {{ link.label }}
      </router-link>
    </nav>

    <div class="flex-1 min-w-0 flex justify-center px-2 sm:px-4" v-if="showFilterBar">
      <MobileFilterBar v-if="isMobile" />
      <transition name="slide-down">
        <FilterBar
          v-show="!isMobile"
          class="w-full max-w-2xl min-w-0"
          :expanded="searchActive"
          @focus="searchActive = true"
          @blur="searchActive = false"
        />
      </transition>
    </div>

    <div class="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
      <!-- Link zum Adminbereich -->
      <router-link
        v-if="isAdmin"
        to="/admin"
        class="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800 md:inline-flex"
      >
        <i class="fa fa-shield-alt"></i>
        Admin Dashboard
      </router-link>

      <!-- Link zum Dashboard wenn Firma eingeloggt ist -->
      <router-link
        v-if="companyData"
        to="/dashboard"
        class="flex items-center gap-1 sm:gap-2 hover:underline whitespace-nowrap"
        :class="compactHeader ? 'text-xs' : ''"
      >
        <img
          :src="companyData.logo_url || '/logo.png'"
          alt="Logo"
          class="rounded-full object-cover transition-all duration-200"
          :class="compactHeader ? 'w-6 h-6' : 'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9'"
        />
        <span class="font-medium text-xs sm:text-sm md:text-base" :class="compactHeader ? 'truncate max-w-[9rem]' : ''">
          {{ companyData.company_name }}
        </span>
      </router-link>

      <template v-if="!isAuthenticated">
        <router-link to="/register" class="btn-outline hidden md:inline-flex items-center">
          <i class="fa fa-key mr-2 animate-bounce"></i>
          Werde Problemsolver:in
        </router-link>
        <router-link
          to="/register"
          class="inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold transition hover:border-gold hover:bg-gold/20 md:hidden"
          v-if="isMobile"
        >
          <i class="fa fa-key text-[0.7rem]"></i>
          Jetzt starten
        </router-link>
      </template>

      <!-- Button zum Öffnen des mobilen Overlays -->
      <button
        @click="toggleOverlay"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/60 text-base text-slate-700 transition-all hover:border-gold/60 hover:text-gold focus:outline-none"
        :class="{ 'rotate-90': showOverlay }"
        aria-label="Menü"
        ref="menuButton"
      >
        <i class="fa fa-bars"></i>
      </button>
    </div>

    <teleport to="body">
      <OverlayMenu
        v-model="showOverlay"
        :companyData="companyData"
        :is-admin="isAdmin"
        :is-authenticated="isAuthenticated"
        @logout="logout"
      />
    </teleport>
  </header>
</template>

<script setup>
// Reaktives State-Management und Lifecycle-Hooks
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// Firebase-Dienste
import { auth, db, isFirebaseConfigured } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
// Overlay-Menü-Komponente
import OverlayMenu from '@/components/common/OverlayMenu.vue'
import FilterBar from '@/components/user/FilterBar.vue'
import MobileFilterBar from '@/components/user/MobileFilterBar.vue'
import { USER_ROLES, clearCachedUserRole, getUserRole, setCachedUserRole } from '@/constants/admin'

const emit = defineEmits(['update-height'])

const router = useRouter()
const route = useRoute()

const navLinks = [
  { label: 'Suche', to: '/' },
  { label: 'Registrieren', to: '/register' },
  { label: 'Hilfe', to: '/hilfe' },
  { label: 'Support', to: '/support' },
]

const showFilterBar = computed(() => route.name === 'home')
const isMobile = ref(false)
const compactHeader = computed(() => isMobile.value && showFilterBar.value)
// steuert die Sichtbarkeit des Menüs
const showOverlay = ref(false)
// Daten des eingelog gten Unternehmens
const companyData = ref(null)
// Aktuell eingeloggter User
const currentUser = ref(null)
// Merkt sich, ob der aktuelle User Adminrechte hat
const isAdmin = ref(false)
// Referenz auf den Menü-Button für Click-Outside-Handling
const menuButton = ref(null)
// Referenz auf den Header für dynamische Höhe
const headerRef = ref(null)
// zeigt an, ob die Suchleiste aktiv ist
const searchActive = ref(false)
let resizeObserver = null
let unsubscribeAuth = null
// zeigt, ob die Ansicht mobil ist
const isAuthenticated = computed(() => Boolean(currentUser.value))

// Menü ein- oder ausblenden
function toggleOverlay() {
  showOverlay.value = !showOverlay.value
}


// schließt das Overlay, wenn außerhalb geklickt wird
function handleClickOutside(event) {
  if (!showOverlay.value) return
  const menuEl = menuButton.value
  if (menuEl && menuEl.contains(event.target)) return
  showOverlay.value = false
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
  if (isFirebaseConfigured) {
    fetchCompanyData(auth.currentUser)
    try {
      unsubscribeAuth = onAuthStateChanged(
        auth,
        fetchCompanyData,
        (error) => {
          console.error('Fehler bei der Authentifizierungserkennung:', error)
          companyData.value = null
        }
      )
    } catch (error) {
      console.error('Konnte Authentifizierungs-Listener nicht registrieren:', error)
    }
  }
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
  if (typeof unsubscribeAuth === 'function') {
    unsubscribeAuth()
  }
})

// Lädt die Unternehmensdaten des eingeloggten Users
async function fetchCompanyData(user) {
  currentUser.value = user
  if (!user) {
    isAdmin.value = false
    clearCachedUserRole()
    companyData.value = null
    return
  }

  const role = await getUserRole(user, { forceRefresh: true })
  setCachedUserRole(user.uid, role)
  isAdmin.value = role === USER_ROLES.ADMIN

  if (!isFirebaseConfigured || isAdmin.value) {
    companyData.value = null
    return
  }
  try {
    const docRef = doc(db, 'companies', user.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      if (data?.is_admin) {
        isAdmin.value = true
        companyData.value = null
        return
      }
      companyData.value = data
    } else {
      companyData.value = null
    }
  } catch (error) {
    console.error('Fehler beim Laden der Firmendaten:', error)
    companyData.value = null
  }
}

// Ausloggen des Users und Redirect
async function logout() {
  if (!isFirebaseConfigured) return
  if (currentUser.value?.uid) {
    clearCachedUserRole(currentUser.value.uid)
  }
  await signOut(auth)
  isAdmin.value = false
  companyData.value = null
  router.push('/')
}
</script>

<style scoped>
.header-shell {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  color: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(248, 250, 252, 0.85);
  backdrop-filter: blur(18px);
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
  transition: padding 0.25s ease;
}

.header-shell.header-compact {
  padding: 0.65rem 0.75rem;
}

.header-shell.header-search-active {
  padding-top: 0.95rem;
  padding-bottom: 0.95rem;
}

@media (min-width: 640px) {
  .header-shell {
    padding: 1rem 1.5rem;
  }

  .header-shell.header-compact {
    padding: 0.85rem 1.25rem;
  }

  .header-shell.header-search-active {
    padding-top: 1.35rem;
    padding-bottom: 1.35rem;
  }
}

@media (min-width: 1024px) {
  .header-shell {
    padding: 1.25rem 2.5rem;
  }

  .header-shell.header-compact {
    padding: 1.1rem 2rem;
  }
}

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
