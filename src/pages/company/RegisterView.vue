<template>
  <div class="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow">
    <h1 class="text-3xl font-semibold mb-8 text-center text-black">
      <p class="text-center text-gold font-medium mb-4">
        <i class="fa fa-key mr-2 animate-bounce"></i> Werde Problemsolver:in
      </p>
      Registrieren
    </h1>

    <button
      @click="registerWithGoogle"
      class="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold mb-2"
      aria-label="Mit Google registrieren"
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
      <span class="text-gray-700 font-medium">Mit Google registrieren</span>
    </button>
    <p v-if="googleError" class="text-red-600 text-sm text-center mt-2">{{ googleError }}</p>
    <div v-if="googleLoading" class="flex justify-center mt-2">
      <Loader :size="40" />
    </div>
    <div class="text-center text-gray-400 mb-6">oder mit E-Mail registrieren</div>

    <Transition name="fade">
      <FormKit
        type="form"
        :actions="false"
        @submit="register"
        :config="{ validationVisibility: 'blur' }"
        class="space-y-6"
      >
        <FormKit
          type="text"
          name="company_name"
          label="Firmenname"
          validation="required"
          placeholder="z. B. Schlüsseldienst Müller"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="email"
          name="email"
          label="E-Mail"
          validation="required|email"
          placeholder="beispiel@firma.de"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="password"
          name="password"
          label="Passwort"
          validation="required|min:6"
          placeholder="Mind. 6 Zeichen"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="password"
          name="confirm_password"
          label="Passwort wiederholen"
          validation="required|confirm:password"
          placeholder="Nochmals eingeben"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="tel"
          name="phone"
          label="Telefonnummer"
          validation="required"
          placeholder="z. B. 0151 12345678"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="text"
          name="address"
          label="Straße und Hausnummer"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="text"
          name="city"
          label="Ort"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="text"
          name="postal_code"
          label="Postleitzahl"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="number"
          name="price"
          label="Preis (ab)"
          min="0"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="textarea"
          name="description"
          label="Beschreibung"
          :classes="{ label: 'label', input: 'textarea' }"
        />

        <OpeningHoursForm v-model="openingHours" />


        <FormKit
          type="checkbox"
          name="is_247"
          label="24/7 Notdienst"
          v-model="is247"
          :classes="{ label: 'label' }"
        />

        <FormKit
          v-if="is247"
          type="number"
          name="emergency_price"
          label="Notdienstpreis"
          validation="required"
          min="0"
          :classes="{ label: 'label', input: 'input' }"
        />

        <Button class="w-full mt-2">Registrieren</Button>
      </FormKit>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { loginWithGoogle } from '@/services/auth'
import Button from '@/components/common/Button.vue'
import OpeningHoursForm from '@/components/company/OpeningHoursForm.vue'
import Loader from '@/components/common/Loader.vue'

const router = useRouter()
const is247 = ref(false)
const googleLoading = ref(false)
const googleError = ref('')
const openingHours = ref({})


const register = async (form) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    )
    await setDoc(doc(db, 'companies', user.uid), {
      company_name: form.company_name,
      email: form.email,
      phone: form.phone,
      address: form.address || '',
      city: form.city || '',
      postal_code: form.postal_code || '',
      price: form.price || '',
      description: form.description || '',
      opening_hours: openingHours.value,
      is_247: form.is_247 || false,
      emergency_price: form.is_247 ? form.emergency_price || '' : '',
      created_at: new Date().toISOString(),
      verified: false,
    })
    router.push({
      name: 'success',
      query: { msg: 'Registrierung erfolgreich', next: '/dashboard' }
    })
  } catch (e) {
    alert('Fehler bei der Registrierung: ' + e.message)
  }
}

const registerWithGoogle = async () => {
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
        verified: true,
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

