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
          type="submit"
          label="Registrieren"
          :classes="{ input: 'btn w-full' }"
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

