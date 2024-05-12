import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'

const runtimeConfig = useRuntimeConfig()

export default NuxtAuthHandler({
  pages: {
    signIn: '/login',
  },
  providers: [GoogleProvider.default({
    clientId: runtimeConfig.GOOGLE_CLIENT_ID,
    clientSecret: runtimeConfig.GOOGLE_CLIENT_SECRET,
  })],
})
