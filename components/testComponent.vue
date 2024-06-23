<template>
  <h2>Test component</h2>
  <p>Property: {{ testState.property }}</p>
  <ForEachComponent v-for="(booking, i) in testState.bookings" v-model="testState.bookings[i]" :key="i" :all-items="allItems" @updated-quantity="updateStock" />
</template>

<script setup lang="ts">
const allItems = ref([
  { name: 'item 1', id: 1, stock: 5, selectedQuantity: 0 },
  { name: 'item 2', id: 2, stock: 10, selectedQuantity: 0 },
  { name: 'item 3', id: 3, stock: 7, selectedQuantity: 0 },
  { name: 'item 4', id: 4, stock: 2, selectedQuantity: 0 },
])




const testStore = useTestStore()
const {testState} = testStore

const updateStock = () => {
  console.log("updated stock");
}

</script>