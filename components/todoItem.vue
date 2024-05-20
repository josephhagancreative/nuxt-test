<template>
  <form class="form" @submit.prevent="onSaveEdit">
    <InputText class="input" v-if="isEditMode" v-model="textInputRef" />
    <p v-else class="text" :class="todoComplete && 'isComplete'">{{ todo.text }}</p>
    <div class="buttons">
      <Button v-if="isEditMode || todoComplete" icon="pi pi-trash" severity="danger" size="small" @click="deleteTodos([todo.id], user?.id || 0)" text />
      <Button v-if="isEditMode" icon="pi pi-replay" severity="warning" size="small" @click="onCancelEdit" text />
      <Button v-if="isEditMode" icon="pi pi-save" severity="success" size="small" @click="onSaveEdit" text />
      <Button v-if="!todoComplete && !isEditMode" icon="pi pi-pencil" severity="info" size="small" @click="isEditMode = !isEditMode" text />
      <Button v-if="!todoComplete && !isEditMode" icon="pi pi-check-square" severity="success" size="small" @click="onToggleComplete" text />
      <Button v-if="todoComplete" icon="pi pi-undo" severity="info" size="small" @click="onToggleComplete" text />
    </div>
  </form>
  </template>

<script setup lang="ts">
import type { Todo } from '~/drizzle/schema';

const userStore = useUserStore()
const user = computed(() => userStore.getUser())

const todoStore = useTodosStore()
const {updateTodoText} = todoStore

const isEditMode = ref(false)

const props = defineProps<{
  todo: Todo
  deleteTodos: (id: number[], userId: number) => void
  toggleCompleteTodo: (id: number, isComplete: boolean) => void
}>()

const textInputRef = ref(props.todo.text)


const todoComplete = ref(props.todo.isComplete)

const onToggleComplete = () => {
  props.toggleCompleteTodo(props.todo.id, !todoComplete.value)
  todoComplete.value = !todoComplete.value
}

const onCancelEdit = () => {
    textInputRef.value = props.todo.text
    isEditMode.value = false
}

const onSaveEdit = async () => {
  const updatedTodo = await updateTodoText(textInputRef.value, props.todo.id)
  textInputRef.value = updatedTodo.text
  isEditMode.value = false
}

</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  width: 100%;
  min-height: 50px;
  padding-left: 0.5rem;

  > .input {
    border: none;
    outline: none;
    box-shadow: none;
    background-color: rgb(248, 248, 248);
  }
}
.isComplete {
  text-decoration: line-through;
}

.buttons {
  display: flex;
  flex-shrink: 0;
}
</style>
