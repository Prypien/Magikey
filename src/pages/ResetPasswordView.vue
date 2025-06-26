<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow">
    <h1 class="text-2xl font-semibold mb-6 text-center text-black">Passwort zurücksetzen</h1>
    <FormKit type="form" :actions="false" @submit="sendReset" :config="{ validationVisibility: 'live' }">
      <FormKit type="email" name="email" label="E-Mail" validation="required|email" v-model="email" :classes="{ label: 'label', input: 'input' }" />
      <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      <Button :disabled="loading" class="w-full mt-4">
        <span v-if="loading">Senden...</span>
        <span v-else>Reset-Link anfordern</span>
      </Button>
    </FormKit>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { resetPassword } from '@/services/auth'
import Button from '@/components/common/Button.vue'

const email = ref('')
const message = ref('')
const error = ref('')
const loading = ref(false)

const sendReset = async () => {
  message.value = ''
  error.value = ''
  loading.value = true
  try {
    await resetPassword(email.value)
    message.value = 'E-Mail zum Zurücksetzen wurde gesendet'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
