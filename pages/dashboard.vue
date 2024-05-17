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
        <TodoItem :todo="todo" :delete-todos="deleteTodos" :toggle-complete-todo="toggleCompleteTodo" />
      </div>
    </div>
  </div>
  <Dialog v-model:visible="modalVisible" modal :header="getModalHeader()" :style="{ width: '25rem' }" :closable="false">
<ModalContentChecking v-if="isCheckingOutdatedTodos" :complete-outdated-todo="toggleCompleteTodo" @finished-checking="isCheckingOutdatedTodos = false"  :todos="outDatedTodos" :delete-todos="deleteTodos" />
<ModalContentSaving
v-else @handle-expired="handleExpiredTodos" :toggle-selected-todo="toggleSelectedTodo"  
:carry-over-amount="user?.amountOfCarryOverTodos!"
:todos="outDatedTodos" />
</Dialog>
  </template>

<script lang="ts" setup>
import {formatDate} from "date-fns"
import ModalContentChecking from "~/components/modalContentChecking.vue";
import type { OutdatedTodo, Todo } from '~/drizzle/schema';

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

const textInputRef = ref("")
const todos = ref<Todo[]>([])
const outDatedTodos = ref<OutdatedTodo[]>([])

const getAllTodos = async () => {
  const fetchedTodos = await $fetch<Todo[]>(`/api/todos?userId=${user.value?.id}`)
  if (fetchedTodos) todos.value = fetchedTodos
}

const addTodo = async () => {
  const addedTodo = await $fetch<Todo>("/api/todos", {
    method: "POST",
    body: {
      text: textInputRef.value,
      userId: user.value?.id
    }
  })
  todos.value.push(addedTodo)
  textInputRef.value = ""
}

// TODO refactor to check todos or Outdated todos
const toggleCompleteTodo = async (id: number, isComplete: boolean) => {
 await $fetch("/api/todos", {
    method: "PUT",
    body: {
      userId: user.value?.id,
      todoId: id,
      isComplete,
    }
  })
  const todoToUpdate = todos.value.find(todo => todo.id === id);
    if (todoToUpdate)
      todoToUpdate.isComplete = isComplete;
      const updatedTotalCompletionsUser = await $fetch("/api/users/", {
        method: "PUT",
        body: {
          userId: user.value?.id,
          todoCompleted: true,
          setCompleted: isComplete ? 1 : 0
        }
      })
      if(updatedTotalCompletionsUser) 
        userStore.setUser(updatedTotalCompletionsUser)
}

const checkForOutdatedTodos = () => {
  const currentDateTime = new Date();
  const currentTodos: Todo[] = [];
  const outdatedTodos: OutdatedTodo[] = [];

  todos.value.forEach(todo => {
    const todoExpirationDate = new Date(todo.expirationDate!);

    if (currentDateTime > todoExpirationDate) 
      outdatedTodos.push({...todo, selected: false});
     else 
      currentTodos.push(todo);
    
  });

  todos.value = currentTodos;
  outDatedTodos.value = [...outDatedTodos.value, ...outdatedTodos];

  if (outdatedTodos.length > 0) 
    modalVisible.value = true;
    isCheckingOutdatedTodos.value = true
};


const deleteTodos = async (ids: number[]) => {
  await $fetch("/api/todos", {
    method: "DELETE",
    body: {
      todoId: ids,
      userId: user.value?.id
    }
  })
  await getAllTodos()
  checkForOutdatedTodos()
}

const toggleSelectedTodo = (todoId: number) => {
  const selectedCount = outDatedTodos.value.filter(todo => todo.selected).length;

  const currentTodoIndex = outDatedTodos.value.findIndex(todo => todo.id === todoId);
  if (currentTodoIndex === -1) return;

  const currentTodo = outDatedTodos.value[currentTodoIndex];

  if (!currentTodo.selected && user.value?.amountOfCarryOverTodos) {
    if (selectedCount >= user.value?.amountOfCarryOverTodos) {
      const firstSelectedIndex = outDatedTodos.value.findIndex(todo => todo.selected);
      if (firstSelectedIndex !== -1) {
        outDatedTodos.value[firstSelectedIndex] = {
          ...outDatedTodos.value[firstSelectedIndex],
          selected: false
        };
      }
    }
    outDatedTodos.value[currentTodoIndex] = {
      ...currentTodo,
      selected: true
    };
  } else {
    outDatedTodos.value[currentTodoIndex] = {
      ...currentTodo,
      selected: false
    };
  }
  outDatedTodos.value = [...outDatedTodos.value];
};

const handleExpiredTodos = async () => {
  const selectedTodos = outDatedTodos.value.filter(todo => todo.selected);
  const unselectedTodos = outDatedTodos.value.filter(todo => !todo.selected);

  const todosToDelete = []
  for (const todo of unselectedTodos) 
    todosToDelete.push(todo.id)
  
  if (todosToDelete.length > 0) 
    await deleteTodos(todosToDelete)
  

  const todosToUpdate = []
  for (const todo of selectedTodos) 
    todosToUpdate.push(todo.id)
  

    if (todosToUpdate.length > 0) {
      await $fetch("/api/todos/update-expiration", {
        method: "PUT",
        body: {
          todoIds: todosToUpdate
        }
      })
    }

  todos.value = [...todos.value, ...selectedTodos];

  outDatedTodos.value = [];
  todos.value = [...todos.value];
  modalVisible.value = false
}

onMounted( async () =>{
    await getAllTodos()
    checkForOutdatedTodos()
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
  padding-left: 0.5rem;

  &.selected {
    outline: 2px solid #f7e581;

    > .buttons > .button {
      color: #f7e581;
    }
  }
}
</style>
