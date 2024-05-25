<template>
  <div>
    <h1>Test</h1>
    <h1 class="h1-r">This is h1 style</h1>
    <h1 class="h1-m">This is h1 style</h1>
    <h1>This is default h1 style</h1>
    <p class="body-m">This is body M text</p>
    <p class="body-r">This is body R text</p>
    <p class="">This is not body text</p>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({
    auth: {
    unauthenticatedOnly: false,
  },
  })
</script>

<style lang="scss">
.h1-r {
  @include apply-text-style(H1,32,M,U);
}
.h1-m {
  @include apply-text-style(H1,32,M)
}
.body-m {
  @include apply-text-style(BD,16,M, U);
}

.body-r {
  @include apply-text-style(BD,16,R);
}
</style>
