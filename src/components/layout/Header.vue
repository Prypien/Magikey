<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-200 text-gray-900 px-6 py-4 shadow-sm flex justify-between items-center">
    <!-- Logo -->
    <router-link to="/" class="flex items-center gap-2">
      <img src="'/logo.png'" alt="Logo" class="h-8 w-auto" />
      <span class="font-bold text-lg text-gold">Magikey</span>
    </router-link>

    <!-- Login/Firma rechts -->
    <div v-if="companyData" class="flex items-center gap-4">
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
                  </div>

                  <div v-else>
                    <Button size="sm" class="bg-white/90 text-black shadow-md backdrop-blur" @click="showLogin = true">Dein Unternehmen</Button>
                  </div>

                 <LoginModal v-if="showLogin" @close="showLogin = false" />
                </header>
              </template>

              <script setup>
              import { ref, onMounted } from 'vue'
              import { useRouter } from 'vue-router'
              import { auth } from '@/firebase/firebase'
              import { doc, getDoc, getFirestore } from 'firebase/firestore'
              import { onAuthStateChanged } from 'firebase/auth'
              import LoginModal from '@/components/modals/LoginModal.vue'
              import Button from '@/components/UI/Button.vue'

              const db = getFirestore()
              const router = useRouter()
              const showLogin = ref(false)
              const showMenu = ref(false)
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
