<template>
  <div class="min-h-screen bg-white p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gold">🔐 Jetzt registrieren</h1>

    <FormKit
      type="form"
      :actions="false"
      @submit="submitRegistration"
      :config="{ validationVisibility: 'live' }"
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
                  <FormKit
                    v-if="is_247"
                    type="number"
                    name="emergency_price"
                    label="Notdienstpreis"
                  />

            <FormKit type="password" name="password" label="Passwort" validation="required|min:6" />
            <FormKit type="password" name="repeatPassword" label="Passwort wiederholen" validation="required|min:6" />

            <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>

            <FormKit
              type="submit"
              label="Registrieren"
              :disabled="loading"
              :classes="{
                input: 'w-full bg-gold text-black py-2 rounded font-semibold mt-4 hover:bg-gold/80'
              }"
            />
          </FormKit>
        </div>
      </template>

      <script setup>
      import { ref } from 'vue'
      import { auth, db } from '@/firebase/firebase'
      import { createUserWithEmailAndPassword } from 'firebase/auth'
      import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

      import OpeningHoursEditor from '@/components/widgets/company/OpeningHoursEditor.vue'

      const error = ref('')
      const loading = ref(false)
      const is_247 = ref(false)

      const openingHours = ref({
        monday: { open: '', close: '' },
        tuesday: { open: '', close: '' },
        wednesday: { open: '', close: '' },
        thursday: { open: '', close: '' },
        friday: { open: '', close: '' },
        saturday: { open: '', close: '' },
  sunday: { open: '', close: '' }
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
    const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
    const uid = cred.user.uid
    await setDoc(doc(db, 'companies', uid), {
      ...formData,
      opening_hours: openingHours.value,
      created_at: serverTimestamp(),
      rating: 0.0
    })
    window.location.href = '/dashboard'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
