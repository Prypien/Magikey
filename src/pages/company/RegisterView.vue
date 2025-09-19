<!-- Diese Datei enthält das Registrierungsformular für Firmen. -->
<template>
  <div class="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow">
    <h1 class="text-3xl font-semibold mb-8 text-center text-black">
      <p class="text-center text-gold font-medium mb-4">
        <i class="fa fa-key mr-2 animate-bounce"></i> Werde Problemsolver:in
      </p>
      Registrieren
    </h1>

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

        <PasswordField />

        <FormKit
          type="password"
          name="confirm_password"
          label="Passwort wiederholen"
          validation="required|confirm:password"
          placeholder="Nochmals eingeben"
          :classes="{ label: 'label', input: 'input' }"
          autocomplete="new-password"
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
          name="postal_code"
          label="Postleitzahl"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="text"
          name="city"
          label="Ort"
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

        <div>
          <label class="label">Schlosstypen</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label v-for="opt in lockTypeOptions" :key="opt.value" class="flex items-center gap-2 text-sm">
              <input type="checkbox" :value="opt.value" v-model="lockTypes" class="accent-gold" />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>

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
import Button from '@/components/common/Button.vue'
import PasswordField from '@/components/common/PasswordField.vue'
import OpeningHoursForm from '@/components/company/OpeningHoursForm.vue'
import { LOCK_TYPE_OPTIONS } from '@/constants/lockTypes'
import { sendVerificationEmail } from '@/services/auth'

const router = useRouter()
const is247 = ref(false)
const openingHours = ref({})
const lockTypes = ref([])
const lockTypeOptions = LOCK_TYPE_OPTIONS


const register = async (form) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    )
    const companyRef = doc(db, 'companies', user.uid)
    const existing = await getDoc(companyRef)
    if (!existing.exists()) {
      await setDoc(companyRef, {
        company_name: form.company_name,
        email: form.email,
        phone: form.phone,
        address: form.address || '',
        city: form.city || '',
        postal_code: form.postal_code || '',
        price: form.price || '',
        description: form.description || '',
        lock_types: lockTypes.value,
        opening_hours: openingHours.value,
        is_247: form.is_247 || false,
        emergency_price: form.is_247 ? form.emergency_price || '' : '',
        created_at: new Date().toISOString(),
        verified: false,
      })
    }
    await sendVerificationEmail(user)
    router.push({
      name: 'success',
      query: { msg: 'Registrierung erfolgreich! Bitte bestätige deine E-Mail.', next: '/dashboard' }
    })
  } catch (e) {
    alert('Fehler bei der Registrierung: ' + e.message)
  }
}

</script>

