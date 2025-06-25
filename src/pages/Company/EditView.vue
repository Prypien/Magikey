<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">🔧 Firmenprofil bearbeiten</h1>

    <FormKit
      type="form"
      :actions="false"
      @submit="saveChanges"
      :config="{ validationVisibility: 'live' }"
    >
      <CompanyImageUpload :initialImageUrl="company.logo_url" @uploaded="url => company.logo_url = url" />

      <FormKit type="text" name="company_name" label="Firmenname" validation="required" v-model="company.company_name" />
      <FormKit type="tel" name="phone" label="Telefonnummer" v-model="company.phone" />
      <FormKit type="text" name="address" label="Straße und Hausnummer" v-model="company.address" />
      <FormKit type="text" name="city" label="Ort" v-model="company.city" />
      <FormKit type="text" name="postal_code" label="Postleitzahl" v-model="company.postal_code" />
      <FormKit type="number" name="price" label="Preis (ab)" v-model="company.price" />
      <FormKit type="textarea" name="description" label="Beschreibung" v-model="company.description" />

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

      <div class="flex gap-4 mt-6">
        <button type="submit" class="bg-[#d9a908] text-black px-4 py-2 rounded font-semibold">
          Änderungen speichern
        </button>
        <button
          type="button"
          @click="confirmDelete"
          class="bg-red-600 text-white px-4 py-2 rounded font-semibold"
        >
          Konto löschen
        </button>
      </div>
    </FormKit>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import CompanyImageUpload from '@/components/company/CompanyImageUpload.vue'
import OpeningHoursEditor from '@/components/company/OpeningHoursEditor.vue'

const router = useRouter()
const user = auth.currentUser

const emptyHours = {
  monday: { open: '', close: '' },
  tuesday: { open: '', close: '' },
  wednesday: { open: '', close: '' },
  thursday: { open: '', close: '' },
  friday: { open: '', close: '' },
  saturday: { open: '', close: '' },
  sunday: { open: '', close: '' },
}

const company = ref({
  company_name: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
  price: '',
  description: '',
  logo_url: '',
  is_247: false,
  emergency_price: '',
  opening_hours: { ...emptyHours },
})

function updateOpeningHours({ day, type, value }) {
  company.value.opening_hours[day][type] = value
}

onMounted(async () => {
  if (!user) return
  const docSnap = await getDoc(doc(db, 'companies', user.uid))
  if (docSnap.exists()) {
    company.value = { ...company.value, ...docSnap.data() }
  }
})

const saveChanges = async () => {
  if (!user) return
  await updateDoc(doc(db, 'companies', user.uid), company.value)
  window.alert('Änderungen gespeichert.')
  router.push('/dashboard')
}

const confirmDelete = async () => {
  const confirmed = window.confirm('Bist du sicher, dass du dein Konto löschen willst?')
  if (!confirmed || !user) return
  await deleteDoc(doc(db, 'companies', user.uid))
  await user.delete()
  window.alert('Konto gelöscht')
  router.push('/')
}
</script>
