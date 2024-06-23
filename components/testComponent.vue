<template>
  <h2>Test component</h2>
  <p>Property: {{ testState.property }}</p>
  <ForEachComponent v-for="(booking, i) in testState.bookings" v-model="testState.bookings[i]" :key="i" />
</template>

<script setup lang="ts">



const testStore = useTestStore()
const {testState} = testStore
</script>