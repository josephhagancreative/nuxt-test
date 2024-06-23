<template>
  <div class="cont">
    <label for="">{{ item.name }}</label>
    <Dropdown v-model="dropDownRef" option-value="value" :options="numbers" option-label="label" @update:model-value="onUpdate" />
  </div>
</template>

<script setup lang="ts">
import type { Item } from '~/stores/testStore';

const props = defineProps<{
  item: Item
  selectedItems: Item[]
}>()

const dropDownRef = ref(props.selectedItems.find(selectedItem => selectedItem.id === props.item.id)?.selectedQuantity || 0)

const emits = defineEmits<{
  (e: "updateQuantity", id: number, quantity: number): void
}>()

const numbers = computed(() => Array.from({ length: props.item.stock + 1 }, (_, i) => ({ label: i.toString(), value: i })));

const onUpdate = (quantity: number) => {
emits("updateQuantity", props.item.id, quantity)
}
</script>

<style lang="scss" scoped>
.cont {
  display: flex;
  gap: 1rem 0.5rem;
  margin-bottom: 1rem;
}
</style>
