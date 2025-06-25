<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-xl p-8 w-full max-w-sm shadow relative">
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        &times;
      </button>

      <h2 class="text-xl font-semibold mb-4 text-center text-black">Login für Unternehmen</h2>

      <FormKit
        type="form"
        :actions="false"
        @submit="login"
        :config="{ validationVisibility: 'live' }"
      >
        <FormKit
          type="email"
          name="email"
          label="E-Mail"
          validation="required|email"
          v-model="email"
          :classes="{ label: 'label', input: 'input' }"
        />

        <FormKit
          type="password"
          name="password"
          label="Passwort"
          validation="required|min:6"
          v-model="password"
          :classes="{ label: 'label', input: 'input' }"
        />

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <Button
          :disabled="loading"
          class="w-full mt-4"
        >
          <span v-if="loading">Lade...</span>
          <span v-else>Einloggen</span>
        </Button>

        <button
          @click="goToRegister"
          class="w-full text-sm text-blue-600 hover:underline mt-4"
        >
          Noch kein Konto? Jetzt registrieren
        </button>
      </FormKit>
    </div>
  </div>
</template>