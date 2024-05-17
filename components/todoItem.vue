<template>
  <p :class="todoComplete && 'isComplete'">{{ todo.text }}</p>
        <div class="buttons">
          <Button icon="pi pi-times" severity="danger" size="small" @click="deleteTodos([todo.id])" text />
          <Button v-if="!todoComplete" icon="pi pi-check" severity="success" size="small" @click="updateTodo" text />
          <Button v-if="todoComplete" icon="pi pi-undo" severity="info" size="small" @click="updateTodo" text />
        </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/drizzle/schema';

const props = defineProps<{
  todo: Todo
  deleteTodos: (id: number[]) => void
  toggleCompleteTodo: (id: number, isComplete: boolean) => void
}>()

const todoComplete = ref(props.todo.isComplete)

const updateTodo = () => {
  props.toggleCompleteTodo(props.todo.id, !todoComplete.value)
  todoComplete.value = !todoComplete.value
}
</script>

<style scoped lang="scss">
.isComplete {
  text-decoration: line-through;
}
</style>
