<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-sm relative">
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        &times;
      </button>

      <h2 class="text-xl font-bold mb-4 text-center">Login für Unternehmen</h2>

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
          :classes="{ label: 'label' }"
        />

        <FormKit
          type="password"
          name="password"
          label="Passwort"
          validation="required|min:6"
          v-model="password"
          :classes="{ label: 'label' }"
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