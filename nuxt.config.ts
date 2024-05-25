// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  auth: {
    globalAppMiddleware: true,
  },
  devtools: { enabled: true },
  css: [
    'primevue/resources/themes/aura-light-noir/theme.css',
    'primeicons/primeicons.css',
    'assets/main.scss',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/_text-styles.scss";',
        },
      },
    },
  },
  googleFonts: {
    families: {
      Raleway: true,
      Ubuntu: true,
    },
  },
  modules: ['nuxt-primevue', '@sidebase/nuxt-auth', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', '@nuxtjs/google-fonts'],
  primevue: {
    options: {
      ripple: true,
    },
  },
  runtimeConfig: {
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    public: {
      env: 'DEV',
    },
  },
})
