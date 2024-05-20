<template>
  <div class="container">
    <h1 class="header">Hello {{ user?.name || "User" }}</h1>
    <h2 class="date">{{ formatDate(new Date(), "yyyy-mm-dd")  }}</h2>
    <form class="input-form" @submit.prevent="handleAddToodo">
      <InputText v-model="textInputRef" size="small" />
      <Button label="Add Todo" icon="pi pi-check" @click="handleAddToodo" size="small" />
    </form>
    <div class="todo-container">
      <h3>Todos: </h3>
      <div class="todo-item" v-for="todo in todos" :key="todo.id">
        <TodoItem :todo="todo" :delete-todos="deleteTodos" :toggle-complete-todo="handleToggleCompleteTodo" />
      </div>
    </div>
  </div>
  <Dialog v-model:visible="modalVisible" modal :header="getModalHeader()" :style="{ width: '25rem' }" :closable="false">
<ModalContentChecking v-if="isCheckingOutdatedTodos" :complete-outdated-todo="handleToggleCompleteTodo" @finished-checking="isCheckingOutdatedTodos = false"  :todos="outDatedTodos" :delete-todos="deleteTodos" />
<ModalContentSaving
v-else @handle-expired="onHandleExpiredTodos" :toggle-selected-todo="handleToggleSelectedTodo"  
:carry-over-amount="user?.amountOfCarryOverTodos!"
:todos="outDatedTodos" />
</Dialog>
  </template>

<script lang="ts" setup>
import {formatDate} from "date-fns"
import ModalContentChecking from "~/components/modalContentChecking.vue";

const modalVisible = ref(false)
const isCheckingOutdatedTodos = ref(false)

const getModalHeader = () => {
  if (isCheckingOutdatedTodos.value) 
    return "Did you finish these todos?"
   else 
    return "Select Todos to Carry Over"
  
}

const userStore = useUserStore()
const user = computed(() => userStore.getUser())

const todoStore = useTodosStore()
const {addTodo, getAllTodos, deleteTodos, checkForOutdatedTodos, toggleCompleteTodo, toggleSelectedTodo, handleExpiredTodos} = todoStore
const {todos, outDatedTodos} = storeToRefs(todoStore)

const textInputRef = ref("")

const handleAddToodo = () => {
  if (!textInputRef.value || !user.value) 
    return
  
  addTodo(textInputRef.value, user.value.id)
  textInputRef.value = ''
}

const handleToggleCompleteTodo = async (id: number, isComplete: boolean) => {
  if (!user.value) return
  const updatedTotalCompletionsUser = await toggleCompleteTodo(id, isComplete, user.value.id )
  userStore.setUser(updatedTotalCompletionsUser)
}

const handleToggleSelectedTodo = (todoId: number) => {
  if (!user.value?.amountOfCarryOverTodos) return
  
  toggleSelectedTodo(todoId, user.value.amountOfCarryOverTodos)
}

const onHandleExpiredTodos = () => {
  if(!user.value) return

  handleExpiredTodos(user.value.id)
    modalVisible.value = false
}

const init = async () => {
    if (!user.value) return
    await getAllTodos(user.value?.id)

    checkForOutdatedTodos()
    if (outDatedTodos.value.length > 0)
      modalVisible.value = true
    isCheckingOutdatedTodos.value = true
}

onMounted( async () =>{
  await init()
})
  
</script>

<style scoped>
.container {
display: flex;
flex-direction: column;
align-items: center;
margin-top: 20vh
}

.header {
  margin: 0.5rem;
}

.date {
  font-weight: 400;
  margin: 0;
  margin-bottom: 3rem;
  color: #5a5a5a;
}

.input-form {
  display: flex;
  gap: 0.5rem;
}

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

  &.selected {
    outline: 2px solid #f7e581;

    > .buttons > .button {
      color: #f7e581;
    }
  }
}
</style>
