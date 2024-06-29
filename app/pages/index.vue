<template>
  <div class="container">
  <h1>Welcome</h1>
  <div class="links">
    <NuxtLink class="link" to="/profile">Profile</NuxtLink>
    <NuxtLink class="link" to="/dashboard">Dashboard</NuxtLink>
    <NuxtLink class="link" to="/login">Login</NuxtLink>
  </div>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/dashboard"
  },
  })
</script>

<style scoped lang="scss">
.container {
display: flex;
flex-direction: column;
align-items: center;
margin-top: 20vh;
}

.links {
  display: flex;
  gap: 1rem;
}

.link {
  font-size: 1.2rem;
  color: black;

  &:hover {
    color: rgb(46, 46, 46);
    font-weight: 600;
  }
}
</style>
