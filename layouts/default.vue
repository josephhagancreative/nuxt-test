<template>
  <nav class="nav-bar" >
    <div>
      <NuxtLink class="link" to="/dashboard" >Dashboard</NuxtLink>
    </div>

    <div class="buttons">
      <Button icon="pi pi-sparkles" :badge="String(user!.completedTodos)"  size="small" outlined />
      <Button v-if="user" :label="user.name!" icon="pi pi-user" size="small" @click="handleGoToProfile"/>
      <Button v-if="user" label="sign out" icon="pi pi-sign-out" @click="handleSignOut" size="small" text />
      <Button v-if="!user" label="log in" icon="pi pi-sign-in" @click="handleLogin" size="small" />
    </div>
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
  justify-content: space-between;
  align-items: center;
  margin: 0rem 0.5rem;
  }

  .link {
    font-size: 0.8rem;
    color: black;
    &:hover {
      color: rgb(36, 36, 36);
    }
  }

.username {
  font-size: 0.75rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}
</style>
