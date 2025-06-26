<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-3xl font-semibold mb-8 text-center text-gray-900">
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
        class="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-gray-100"
      >
        <FormKit
          type="text"
          name="company_name"
          label="Firmenname"
          validation="required"
          placeholder="z. B. Schlüsseldienst Müller"
          outer-class="space-y-1"
          input-class="formkit-input"
        />

        <FormKit
          type="email"
          name="email"
          label="E-Mail"
          validation="required|email"
          placeholder="beispiel@firma.de"
          outer-class="space-y-1"
          input-class="formkit-input"
        />

        <FormKit
          type="password"
          name="password"
          label="Passwort"
          validation="required|min:6"
          placeholder="Mind. 6 Zeichen"
          outer-class="space-y-1"
          input-class="formkit-input"
        />

        <FormKit
          type="password"
          name="confirm_password"
          label="Passwort wiederholen"
          validation="required|confirm:password"
          placeholder="Nochmals eingeben"
          outer-class="space-y-1"
          input-class="formkit-input"
        />

        <FormKit
          type="tel"
          name="phone"
          label="Telefonnummer"
          validation="required"
          placeholder="z. B. 0151 12345678"
          outer-class="space-y-1"
          input-class="formkit-input"
        />

        <FormKit
          type="submit"
          label="Registrieren"
          input-class="bg-gold hover:bg-gold/90 text-white font-semibold py-3 rounded-xl w-full transition duration-200"
        />
      </FormKit>
    </Transition>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const router = useRouter()

const register = async ({ email, password, company_name, phone }) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, 'companies', user.uid), {
      company_name,
      email,
      phone,
      created_at: new Date().toISOString(),
    })
    router.push('/dashboard')
  } catch (e) {
    alert('Fehler bei der Registrierung: ' + e.message)
  }
}
</script>

<style scoped>
.formkit-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-gold transition bg-white text-gray-900;
}
</style>
