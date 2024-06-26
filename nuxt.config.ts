// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  auth: {
    globalAppMiddleware: true,
  },
  devtools: { enabled: true },
  css: [
    'primeicons/primeicons.css',
    'assets/main.css',
  ],
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
    importTheme: { from: '@/themes/mytheme.ts' },
  },
})
