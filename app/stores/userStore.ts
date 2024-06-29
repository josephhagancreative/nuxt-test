import type { User } from '~/drizzle/schema'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const setUser = (newUser: any) => {
    user.value = newUser
  }

  const getUser = () => {
    return user.value
  }

  const resetUser = () => {
    user.value = null
  }

  return { user, setUser, getUser, resetUser }
}, {
  persist: true,
})
