<template>
      <div class="todo-container">
      <p>Check off any completed todos:</p>
      <div class="todo-item" v-for="todo in todos" :key="todo.id">
        <!-- <p :class="todo.isComplete && 'isComplete'">{{ todo.text }}</p>
        <div class="buttons">
          <Button class="button" v-if="!todo.isComplete" icon="pi pi-check" severity="success" size="small" @click="completeOutdatedTodo(todo.id, !todo.isComplete)" text />
        </div> -->
        <TodoItem :todo="todo" :delete-todos="deleteTodos" :toggle-complete-todo="completeOutdatedTodo"  />
      </div>
      </div>
    <div class="modal-buttons">
        <Button type="button" label="Next" @click="onFinishedChecking"/>
    </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/drizzle/schema';

const _props = defineProps<{
  todos: Todo[]
  completeOutdatedTodo: (id: number, isComplete: boolean) => void
  deleteTodos: (id: number[]) => void
}>()

const emits = defineEmits(["finishedChecking"])

const onFinishedChecking = () => {
  emits("finishedChecking")
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
