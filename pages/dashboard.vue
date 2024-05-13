<template>
  <div class="container">
    <h1 class="header">Hello {{ user?.name || "User" }}</h1>
    <h2 class="date">{{ formatDate(new Date(), "yyyy-mm-dd")  }}</h2>
    <form class="input-form" @submit.prevent="addTodo">
      <InputText v-model="textInputRef" size="small" />
      <Button label="Add Todo" icon="pi pi-check" @click="addTodo" size="small" />
    </form>
    <div class="todo-container">
      <h3>Todos: </h3>
      <div class="todo-item" v-for="todo in todos" :key="todo.id">
        <p :class="todo.isComplete && 'isComplete'">{{ todo.text }}</p>
        <div class="buttons">
          <Button icon="pi pi-times" severity="danger" size="small" @click="deleteTodo(todo.id)" text />
          <Button icon="pi pi-check" severity="success" size="small" @click="completeTodo(todo.id)" text />
        </div>
      </div>
    </div>
  </div>
  </template>

<script lang="ts" setup>
import {formatDate} from "date-fns"
import type { Todo } from '~/drizzle/schema';

const userStore = useUserStore()
const user = computed(() => userStore.getUser())

const textInputRef = ref("")
const todos = ref<Todo[]>([])

const getAllTodos = async () => {
  const fetchedTodos = await $fetch(`/api/todos?userId=${user.value.id}`)
  if (fetchedTodos) todos.value = fetchedTodos as Todo[]
}

const addTodo = async () => {
  const addedTodo = await $fetch("/api/todos", {
    method: "POST",
    body: {
      text: textInputRef.value,
      userId: user.value.id
    }
  })
  todos.value.push(addedTodo as Todo)
  textInputRef.value = ""
}

const completeTodo = async (id: number) => {
 await $fetch("/api/todos", {
    method: "PUT",
    body: {
      userId: user.value.id,
      todoId: id
    }
  })
  const todoToUpdate = todos.value.find(todo => todo.id === id);
    if (todoToUpdate)
      todoToUpdate.isComplete = true;
      const updatedTotalCompletionsUser = await $fetch("/api/users/", {
        method: "PUT",
        body: {
          userId: user.value.id,
          todoCompleted: true
        }
      })
      if(updatedTotalCompletionsUser) 
      console.log(updatedTotalCompletionsUser);
        userStore.setUser(updatedTotalCompletionsUser)
      

  
}

const deleteTodo = async (id: number) => {
  await $fetch("/api/todos", {
    method: "DELETE",
    body: {
      todoId: id,
      userId: user.value.id
    }
  })
  todos.value = todos.value.filter(todo => todo.id !== id);
}

onMounted(() =>{
    getAllTodos()
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
  padding: 0 0.5rem 0.5rem 0.5rem;
  gap: 0.25rem;
  margin-top: 1rem;
}

.todo-item {
  display: flex;
  width: 100%;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2e2e2;
  border-radius: 0.5rem;
  padding-left: 0.5rem;
}

.isComplete {
  text-decoration: line-through;
}
</style>
