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

const props = defineProps<{
  allItems: Item[]
}>()

const emits = defineEmits(["updatedQuantity"])

const onUpdate = (id: number, quantity: number) => {
  updateModelValue(id, quantity)
}

const isVisible = ref(false)

function updateModelValue(id: number, quantity: number) {
  const updatedItem = props.allItems.find(item => item.id === id)

  if(updatedItem) {
    const modelItemIdx = model.value.items.findIndex(modelItem =>  modelItem.id === updatedItem.id )
    if(modelItemIdx !== -1) {
      quantity === 0 ? model.value.items.splice(modelItemIdx, 1) :
      model.value.items[modelItemIdx].selectedQuantity = quantity
    } else {
      if (quantity !== 0) model.value.items.push({...updatedItem, selectedQuantity: quantity})
    }
  }
  emits("updatedQuantity")
}
</script>

<style scoped lang="scss">
.cont {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
