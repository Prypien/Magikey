<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Login für Unternehmen</h1>

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
        @click="$router.push('/register')"
        class="w-full text-sm text-blue-600 hover:underline mt-4"
      >
        Noch kein Konto? Jetzt registrieren
      </button>
    </FormKit>
  </div>
</template>

