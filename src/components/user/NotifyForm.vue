<template>
  <form @submit.prevent="submit" class="mt-2 flex gap-2">
    <input
      v-model="email"
      type="email"
      required
      placeholder="E-Mail"
      class="flex-1 border rounded px-3 py-2 text-sm"
    />
    <button class="bg-gold text-black rounded px-4 text-sm">Benachrichtigen</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const email = ref('')

async function submit() {
  await addDoc(collection(db, 'notify_me'), {
    email: email.value,
    created_at: serverTimestamp(),
  })
  email.value = ''
  alert('Danke! Wir melden uns bei dir.')
}
</script>
