<template>
  <h1>Test</h1>
  <p>Default state: {{ testState }}</p>
  <TestComponent />
</template>

<script setup lang="ts">
const testStore = useTestStore()
const {testState} = testStore
</script>