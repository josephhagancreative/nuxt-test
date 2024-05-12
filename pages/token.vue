<template>
  <h1>Token Vue</h1>
  <pre>{{ token || "No Token" }}</pre>
</template>

<script setup lang="ts" >
const headers = useRequestHeaders(["cookie"]) as HeadersInit
const {data: token} = await useFetch("/api/token", {headers})
</script>
