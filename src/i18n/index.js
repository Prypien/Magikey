import { ref } from 'vue'

const messages = {
  de: {
    header: {
      becomeSolver: 'Werde Problemsolver:in',
      language: 'Sprache'
    },
    overlay: {
      helpCenter: 'Hilfe-Center',
      becomeSolver: 'Problemsolver:in werden',
      findLocksmith: 'Schlosser finden',
      login: 'Einloggen',
      editProfile: 'Profil bearbeiten',
      logout: 'Abmelden'
    },
    footer: {
      impressum: 'Impressum',
      datenschutz: 'Datenschutz',
      blog: 'Blog'
    },
    home: {
      heading: 'Magikey, der Schlüsseldienst in deiner Nähe',
      searchPlaceholder: 'Wo brauchst du Hilfe? Postleitzahl',
      loading: 'Firmen werden geladen...',
      noResults: 'Leider kein Anbieter gefunden. Trag dich ein, wir benachrichtigen dich!'
    },
    impressum: {
      title: 'Impressum'
    },
    datenschutz: {
      title: 'Datenschutzerklärung'
    }
  },
  en: {
    header: {
      becomeSolver: 'Become a problemsolver',
      language: 'Language'
    },
    overlay: {
      helpCenter: 'Help Center',
      becomeSolver: 'Become a problemsolver',
      findLocksmith: 'Find locksmith',
      login: 'Login',
      editProfile: 'Edit profile',
      logout: 'Logout'
    },
    footer: {
      impressum: 'Impressum',
      datenschutz: 'Privacy',
      blog: 'Blog'
    },
    home: {
      heading: 'Magikey, locksmith near you',
      searchPlaceholder: 'Where do you need help? Enter postal code',
      loading: 'Loading companies...',
      noResults: 'No providers found. Sign up and we will notify you!'
    },
    impressum: {
      title: 'Legal notice'
    },
    datenschutz: {
      title: 'Privacy policy'
    }
  }
}

const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : {
  getItem: () => null,
  setItem: () => {}
}
const locale = ref(storage.getItem('locale') || 'de')

function t(key) {
  return key.split('.').reduce((obj, k) => obj && obj[k], messages[locale.value]) || key
}

function setLocale(l) {
  locale.value = l
  storage.setItem('locale', l)
}

export default {
  install(app) {
    app.config.globalProperties.$t = t
    app.config.globalProperties.$setLocale = setLocale
    app.provide('t', t)
    app.provide('locale', locale)
    app.provide('setLocale', setLocale)
  }
}
