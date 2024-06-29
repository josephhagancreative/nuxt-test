<template>
  <h1>Login</h1>
  <Button icon="pi pi-google" label="Login with Google" @click="signIn('google', {callbackUrl: '/redirect'})" />
</template>

<script lang="ts" setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/dashboard"
  },
  layout: 'login'
})

const { signIn} = useAuth()
</script>