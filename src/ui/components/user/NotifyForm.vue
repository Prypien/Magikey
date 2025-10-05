<!-- Diese Datei enthält ein Formular für Benachrichtigungs-E-Mails. -->
<template>
  <form @submit.prevent="submit" class="mt-2 flex gap-2" novalidate>
    <input
      v-model="email"
      type="email"
      required
      placeholder="E-Mail"
      autocomplete="email"
      class="flex-1 rounded border px-3 py-2 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/60"
    />
    <button
      type="submit"
      class="rounded bg-gold px-4 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-70"
      :disabled="isSubmitting"
      :aria-busy="isSubmitting"
    >
      <span v-if="isSubmitting">Wird gesendet…</span>
      <span v-else>Benachrichtigen</span>
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { db, isFirebaseConfigured } from '@/core/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const email = ref('')
const isSubmitting = ref(false)

async function submit() {
  const trimmedEmail = email.value.trim()
  if (!trimmedEmail) {
    alert('Bitte gib eine gültige E-Mail-Adresse ein.')
    return
  }

  if (!isFirebaseConfigured || !db) {
    email.value = ''
    alert('Danke! Wir melden uns bei dir, sobald der Service live ist.')
    return
  }

  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    await addDoc(collection(db, 'notify_me'), {
      email: trimmedEmail,
      created_at: serverTimestamp(),
    })
    email.value = ''
    alert('Danke! Wir melden uns bei dir.')
  } catch (error) {
    console.error('Fehler beim Speichern der Benachrichtigungsanfrage:', error)
    alert('Leider konnten wir deine Anfrage nicht speichern. Bitte versuche es später erneut oder schreib uns an info@magikey.de')
  } finally {
    isSubmitting.value = false
  }
}
</script>
