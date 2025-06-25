<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow">
    <h1 class="text-2xl font-semibold mb-6 text-center text-black">Login für Unternehmen</h1>

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
        @click="$router.push('/register')"
        class="w-full text-sm text-blue-600 hover:underline mt-4"
      >
        Noch kein Konto? Jetzt registrieren
      </button>
    </FormKit>
  </div>
</template>

