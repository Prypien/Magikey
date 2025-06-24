<template>
  <div class="min-h-screen bg-white p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gold">🔐 Jetzt registrieren</h1>

    <FormKit
      type="form"
      :actions="false"
      @submit="submitRegistration"
      :config="{ validationVisibility: 'live' }"
    >
      <FormKit type="text" name="company_name" label="Firmenname" validation="required" v-model="company.company_name" />
      <FormKit type="email" name="email" label="E-Mail" validation="required|email" v-model="company.email" />
      <FormKit type="tel" name="phone" label="Telefonnummer" v-model="company.phone" />
      <FormKit type="text" name="address" label="Straße und Hausnummer" v-model="company.address" />
      <FormKit type="text" name="postal_code" label="Postleitzahl" v-model="company.postal_code" />
      <FormKit type="text" name="city" label="Ort" v-model="company.city" />
      <FormKit type="number" name="price" label="Preis (ab)" v-model="company.price" />

      <OpeningHoursEditor :openingHours="company.opening_hours" @update="updateOpeningHours" />

      <FormKit type="checkbox" name="is_247" label="24/7 Notdienst" v-model="company.is_247" />
      <FormKit
        v-if="company.is_247"
        type="number"
        name="emergency_price"
        label="Notdienstpreis"
        validation="required"
        v-model="company.emergency_price"
      />

      <FormKit type="password" name="password" label="Passwort" validation="required|min:6" v-model="password" />
      <FormKit
        type="password"
        name="repeatPassword"
        label="Passwort wiederholen"
        validation="required|matches:password"
        v-model="repeatPassword"
      />

      <div v-if="error" class="text-red-600">{{ error }}</div>

      <Button :disabled="loading" class="w-full mt-4">
        {{ loading ? 'Wird gesendet...' : 'Registrieren' }}
      </Button>
    </FormKit>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth, db } from '@/firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

import Button from '@/components/ui/Button.vue'
import OpeningHoursEditor from '@/components/widgets/company/OpeningHoursEditor.vue'

const company = ref({
  company_name: '',
  email: '',
  phone: '',
  address: '',
  postal_code: '',
  city: '',
  price: '',
  is_247: false,
  emergency_price: '',
  opening_hours: {
    monday: { open: '', close: '' },
    tuesday: { open: '', close: '' },
    wednesday: { open: '', close: '' },
    thursday: { open: '', close: '' },
    friday: { open: '', close: '' },
    saturday: { open: '', close: '' },
    sunday: { open: '', close: '' }
  }
})

const password = ref('')
const repeatPassword = ref('')
const loading = ref(false)
const error = ref('')

function updateOpeningHours({ day, type, value }) {
  company.value.opening_hours[day][type] = value
}

const submitRegistration = async () => {
  if (password.value !== repeatPassword.value) {
    error.value = 'Passwörter stimmen nicht überein'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const cred = await createUserWithEmailAndPassword(auth, company.value.email, password.value)
    const uid = cred.user.uid
    await setDoc(doc(db, 'companies', uid), {
      ...company.value,
      created_at: serverTimestamp(),
      rating: 0.0
    })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
