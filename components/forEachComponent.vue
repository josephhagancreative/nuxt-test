<template>
  <div class="cont">
    <h3>{{ model.name }} </h3>   <Button label="Show" @click="isVisible = true" />
    <span>Items: <span v-for="item in model.items" :key="item.id" > 
 {{" "}}{{ item.name }} Quantity: {{ item.selectedQuantity }} / {{ item.stock }}
    </span> </span>
      <Dialog v-model:visible="isVisible">
    <CustomDropdown v-for="item in allItems" :item="item" :selected-items="model.items" :key="item.id" @update-quantity="onUpdate"  />
  </Dialog>
  </div>

</template>

<script setup lang="ts">
const model = defineModel<Booking>({required: true})

const onUpdate = (id: number, quantity: number) => {
  updateModelValue(id, quantity)
}

const isVisible = ref(false)

const allItems = [
  { name: 'item 1', id: 1, stock: 5, selectedQuantity: 0 },
  { name: 'item 2', id: 2, stock: 10, selectedQuantity: 0 },
  { name: 'item 3', id: 3, stock: 7, selectedQuantity: 0 },
  { name: 'item 4', id: 4, stock: 2, selectedQuantity: 0 },
]

function updateModelValue(id: number, quantity: number) {
  const updatedItem = allItems.find(item => item.id === id)

  if(updatedItem) {
    const modelItemIdx = model.value.items.findIndex(modelItem =>  modelItem.id === updatedItem.id )
    if(modelItemIdx !== -1) {
      quantity === 0 ? model.value.items.splice(modelItemIdx) :
      model.value.items[modelItemIdx].selectedQuantity = quantity
    } else {
      if (quantity !== 0) {
        const newItem = {...updatedItem, selectedQuantity: quantity}
        model.value.items.push(newItem)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.cont {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
