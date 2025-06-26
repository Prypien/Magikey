<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <Transition name="fade" mode="out-in">
      <div v-if="show" class="bg-white/90 rounded-xl shadow max-w-xl w-full p-6">
        <h1 class="text-2xl font-bold mb-4 text-center text-gold">
          🔐 Jetzt registrieren
        </h1>

        <FormKit
          type="form"
          :actions="false"
          @submit="submitRegistration"
          :config="{ validationVisibility: 'live' }"
          class="space-y-4"
        >
          <FormKit type="text" name="company_name" label="Firmenname" validation="required" />
          <FormKit type="email" name="email" label="E-Mail" validation="required|email" />
          <FormKit type="text" name="phone" label="Telefonnummer" />
          <FormKit type="text" name="address" label="Straße und Hausnummer" />
          <FormKit type="text" name="postal_code" label="Postleitzahl" />
          <FormKit type="text" name="city" label="Ort" />
          <FormKit type="number" name="price" label="Preis (ab)" />

          <OpeningHoursEditor :openingHours="openingHours" @update="updateOpeningHours" />

          <FormKit type="checkbox" name="is_247" label="24/7 Notdienst" v-model="is_247" />
          <FormKit v-if="is_247" type="number" name="emergency_price" label="Notdienstpreis" />

          <FormKit type="password" name="password" label="Passwort" validation="required|min:6" />
          <FormKit type="password" name="repeatPassword" label="Passwort wiederholen" validation="required|min:6" />

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

          <FormKit
            type="submit"
            label="Registrieren"
            :disabled="loading"
            :classes="{ input: 'btn w-full' }"
          />
        </FormKit>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

import OpeningHoursEditor from '@/components/company/OpeningHoursEditor.vue'

const error = ref('')
const loading = ref(false)
const is_247 = ref(false)

const show = ref(false)

const openingHours = ref({
  monday: { open: '', close: '' },
  tuesday: { open: '', close: '' },
  wednesday: { open: '', close: '' },
  thursday: { open: '', close: '' },
  friday: { open: '', close: '' },
  saturday: { open: '', close: '' },
  sunday: { open: '', close: '' }
})

onMounted(() => {
  show.value = true
})

function updateOpeningHours({ day, type, value }) {
  openingHours.value[day][type] = value
}

const submitRegistration = async (formData) => {
  if (formData.password !== formData.repeatPassword) {
    error.value = 'Passwörter stimmen nicht überein'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    )
    const uid = cred.user.uid

    const companyData = { ...formData }
    delete companyData.password
    delete companyData.repeatPassword

    await setDoc(doc(db, 'companies', uid), {
      ...companyData,
      opening_hours: openingHours.value,
      created_at: serverTimestamp(),
    })
    window.location.href = '/dashboard'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
