<template>
  <nav class="nav-bar" >
    <NuxtLink class="link" to="/dashboard" >Dashboard</NuxtLink>
    <Button v-if="user" :label="user.name" icon="pi pi-user" size="small" @click="handleGoToProfile"/>
    <Button v-if="user" label="sign out" icon="pi pi-sign-out" @click="handleSignOut" size="small" outlined />
    <Button v-if="!user" label="log in" icon="pi pi-sign-in" @click="handleLogin" size="small" />
  </nav>
  <NuxtPage />
</template>

<script setup lang="ts">
const userStore = useUserStore()
const user = computed(() => userStore.getUser())
const router = useRouter()

const {signOut} = useAuth()

const handleGoToProfile = () => {
  router.push("/profile")
}

const handleSignOut = async () => {
  userStore.resetUser()
  await signOut()
}

const handleLogin = () => {
  router.push("/login")
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  height: 50px;
  justify-content: flex-end;
  gap: 1rem;
  align-items: center;

  > .link {
    font-size: 0.8rem;
    color: black;
    &:hover {
      color: rgb(36, 36, 36);
    }
  }
}

.username {
  font-size: 0.75rem;
}
</style>
