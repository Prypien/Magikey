<template>
  <div class="min-h-screen flex items-stretch bg-gradient-to-br from-white to-yellow-50">
    <div class="flex-1 flex items-center justify-center p-6">
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg max-w-xl w-full p-8 space-y-4">
          <h1 class="text-2xl font-bold mb-4 text-center text-gold">
            🔐 Jetzt registrieren
          </h1>

          <FormKit
            type="form"
            :actions="false"
            @submit="submitRegistration"
            :config="{ validationVisibility: 'live' }"
            class="space-y-6 divide-y divide-gray-200"
          >
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Account</h3>
            <FormKit type="email" name="email" label="E-Mail" validation="required|email" />
            <FormKit type="password" name="password" label="Passwort" validation="required|min:6" />
            <FormKit type="password" name="passwordConfirm" label="Passwort wiederholen" validation="required|confirm:password" validation-label="Passwort" />
          </div>

          <div class="space-y-4 pt-4">
            <h3 class="font-semibold text-lg">Kontakt</h3>
            <CompanyImageUpload @selected="file => (logoFile.value = file)" />
            <FormKit type="text" name="company_name" label="Firmenname" validation="required" />
            <FormKit type="text" name="phone" label="Telefonnummer" />
          </div>

            <div class="space-y-4 pt-4">
              <h3 class="font-semibold text-lg">Standort</h3>
              <GoogleAddressAutocomplete v-model="address.fulltext" @placeChanged="fillAddress" />
              <FormKit type="text" name="street" label="Straße" v-model="address.street" />
              <div class="flex gap-2">
                <FormKit type="text" name="postal_code" label="PLZ" v-model="address.plz" class="flex-1" />
                <FormKit type="text" name="city" label="Ort" v-model="address.city" class="flex-1" />
              </div>
              <GoogleMap
                v-if="address.lat && address.lng"
                :lat="address.lat"
                :lng="address.lng"
                class="mt-2"
              />
            </div>

            <FormKit type="number" name="price" label="Preis (ab)" min="0" />

            <p class="text-sm text-gray-600">Öffnungszeiten werden automatisch von Google übernommen.</p>

              <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

              <button
                type="submit"
                :disabled="loading"
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-xl w-full"
              >
                Registrieren & Teil von Magikey werden
              </button>
            </FormKit>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '@/firebase/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

import GoogleAddressAutocomplete from '@/components/company/GoogleAddressAutocomplete.vue'
import CompanyImageUpload from '@/components/company/CompanyImageUpload.vue'
import GoogleMap from '@/components/company/GoogleMap.vue'
import { uploadCompanyLogo } from '@/services/storage'
import { register as registerUser } from '@/services/auth'


const error = ref('')
const loading = ref(false)

const logoFile = ref(null)
const logoUrl = ref('')

const address = ref({
  fulltext: '',
  street: '',
  plz: '',
  city: '',
  lat: null,
  lng: null,
  placeId: ''
})


function fillAddress(data) {
  address.value.fulltext = data.formatted
  address.value.lat = data.lat
  address.value.lng = data.lng
  address.value.placeId = data.placeId
  const comp = data.components || []
  const street = comp.find(c => c.types.includes('route'))?.long_name || ''
  const number = comp.find(c => c.types.includes('street_number'))?.long_name || ''
  address.value.street = [street, number].filter(Boolean).join(' ')
  address.value.plz = comp.find(c => c.types.includes('postal_code'))?.long_name || ''
  address.value.city = comp.find(c => c.types.includes('locality'))?.long_name || ''
}

const submitRegistration = async (formData) => {
  error.value = ''
  loading.value = true

  try {
    const cred = await registerUser(formData.email, formData.password)
    const uid = cred.user.uid

    if (logoFile.value) {
      logoUrl.value = await uploadCompanyLogo(logoFile.value)
    }

  const companyData = {
    ...formData,
    address: address.value.street,
    postal_code: address.value.plz,
    city: address.value.city,
    logo_url: logoUrl.value,
  }
  delete companyData.street
  delete companyData.password
  delete companyData.passwordConfirm

    await setDoc(doc(db, 'companies', uid), {
      ...companyData,
      opening_hours: {},
      created_at: serverTimestamp(),
    })
    window.alert('Danke! Wir prüfen deinen Eintrag und melden uns bei dir.')
    window.location.href = '/dashboard'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
