export default defineNuxtConfig({
  auth: {
    globalAppMiddleware: true,
  },
  css: [
    'primeicons/primeicons.css',
    '/assets/main.css',
  ],
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  googleFonts: {
    families: {
      Raleway: true,
      Ubuntu: true,
    },
  },
  modules: ['@sidebase/nuxt-auth', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', '@nuxtjs/google-fonts', '@primevue/nuxt-module'],
  runtimeConfig: {
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    public: {
      env: 'DEV',
    },
  },
  primevue: {
    importTheme: { from: '/themes/mytheme.js' },
  },
})
