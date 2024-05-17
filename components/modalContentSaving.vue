<template>
      <div class="todo-container">
      <p>Choose up to {{ carryOverAmount }} to carry over for 24hrs:</p>
      <div class="todo-item" v-for="todo in todos" :key="todo.id" :class="todo.selected && 'selected'">
        <p :class="todo.isComplete && 'isComplete'">{{ todo.text }}</p>
        <div class="buttons">
          <Button class="button" v-if="!todo.isComplete" :icon="todo.selected ? 'pi pi-circle-fill' : 'pi pi-circle'" severity="contrast" size="small" @click="toggleSelectedTodo(todo.id)" text />
        </div>
      </div>
      </div>
    <div class="modal-buttons">
        <Button type="button" label="Confirm" @click="onHandleExpired"/>
    </div>
</template>

<script setup lang="ts">
import type { OutdatedTodo } from '~/drizzle/schema';

const _props = defineProps<{
  todos: OutdatedTodo[]
  carryOverAmount: number
  toggleSelectedTodo: (id: number) => void
}>()

const emits = defineEmits<{
  handleExpired: []
}>()

const onHandleExpired = () => {
  emits("handleExpired")
}
</script>

<style scoped lang="scss">
.todo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e2e2e2;
  border-radius: 0.5rem;
  min-width: 340px;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  gap: 0.25rem;
  margin-top: 1rem;
}

.todo-item {
  display: flex;
  width: 100%;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  outline: 1px solid #e2e2e2;
  border-radius: 0.5rem;
  padding-left: 0.5rem;

  &.selected {
    outline: 2px solid #f7e581;

    > .buttons > .button {
      color: #f7e581;
    }
  }
}

.isComplete {
  text-decoration: line-through;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  margin: 1rem 0
}
</style>
