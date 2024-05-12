<template>
  <h1>Hello {{ user?.name || "User" }}</h1>
  <h1>Total Completions: {{ user?.completedTodos }}</h1>
  <div>
    <InputText v-model="textInputRef" />
    <Button label="Add Todo" icon="pi pi-check" @click="addTodo" />
  </div>
  <Button label="Get Todos" icon="pi pi-check" @click="getAllTodos" />
  <div>
    <h2>Todos: </h2>
    <div class="todo-item" v-for="todo in todos" :key="todo.id">
      <p :class="todo.isComplete && 'isComplete'">{{ todo.text }} {{ todo.isComplete }}</p>
      <Button icon="pi pi-times" severity="danger" size="small" @click="deleteTodo(todo.id)" />
      <Button icon="pi pi-check" severity="success" size="small" @click="completeTodo(todo.id)" />
    </div>
  </div>
  <NuxtLink to="/profile">Profile</NuxtLink>
</template>

<script lang="ts" setup>
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
.todo-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.isComplete {
  text-decoration: line-through;
}
</style>
