import type { OutdatedTodo, Todo } from '~/drizzle/schema'

export const useTodosStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  const outDatedTodos = ref<OutdatedTodo[]>([])

  const addTodo = async (text: string, userId: number) => {
    const addedTodo = await $fetch<Todo>('/api/todos', {
      method: 'POST',
      body: {
        text,
        userId,
      },
    })

    todos.value.push(addedTodo)
  }

  const getAllTodos = async (userId: number) => {
    const fetchedTodos = await $fetch<Todo[]>(`/api/todos?userId=${userId}`)
    if (fetchedTodos)
      todos.value = fetchedTodos
  }

  const deleteTodos = async (ids: number[], userId: number) => {
    await $fetch('/api/todos', {
      method: 'DELETE',
      body: {
        todoId: ids,
        userId,
      },
    })
    await getAllTodos(userId)
  }

  const checkForOutdatedTodos = () => {
    const currentDateTime = new Date()
    const currentTodos: Todo[] = []
    const outdatedTodos: OutdatedTodo[] = []

    todos.value.forEach((todo) => {
      const todoExpirationDate = new Date(todo.expirationDate!)

      if (currentDateTime > todoExpirationDate)
        outdatedTodos.push({ ...todo, selected: false })
      else
        currentTodos.push(todo)
    })

    todos.value = currentTodos
    outDatedTodos.value = [...outDatedTodos.value, ...outdatedTodos]
  }

  const toggleCompleteTodo = async (id: number, isComplete: boolean, userId: number) => {
    await $fetch('/api/todos', {
      method: 'PUT',
      body: {
        userId,
        todoId: id,
        isComplete,
      },
    })
    const todoToUpdate = todos.value.find(todo => todo.id === id)
    if (todoToUpdate)
      todoToUpdate.isComplete = isComplete
    const updatedTotalCompletionsUser = await $fetch('/api/users/', {
      method: 'PUT',
      body: {
        userId,
        todoCompleted: true,
        setCompleted: isComplete ? 1 : 0,
      },
    })
    if (updatedTotalCompletionsUser)
      return updatedTotalCompletionsUser
  }

  const toggleSelectedTodo = (todoId: number, carryOverLimit: number) => {
    const selectedCount = outDatedTodos.value.filter(todo => todo.selected).length

    const currentTodoIndex = outDatedTodos.value.findIndex(todo => todo.id === todoId)
    if (currentTodoIndex === -1)
      return

    const currentTodo = outDatedTodos.value[currentTodoIndex]

    if (!currentTodo.selected) {
      if (selectedCount >= carryOverLimit) {
        const firstSelectedIndex = outDatedTodos.value.findIndex(todo => todo.selected)
        if (firstSelectedIndex !== -1) {
          outDatedTodos.value[firstSelectedIndex] = {
            ...outDatedTodos.value[firstSelectedIndex],
            selected: false,
          }
        }
      }
      outDatedTodos.value[currentTodoIndex] = {
        ...currentTodo,
        selected: true,
      }
    }
    else {
      outDatedTodos.value[currentTodoIndex] = {
        ...currentTodo,
        selected: false,
      }
    }
    outDatedTodos.value = [...outDatedTodos.value]
  }

  const handleExpiredTodos = async (userId: number) => {
    const selectedTodos = outDatedTodos.value.filter(todo => todo.selected)
    const unselectedTodos = outDatedTodos.value.filter(todo => !todo.selected)

    const todosToDelete = []
    for (const todo of unselectedTodos)
      todosToDelete.push(todo.id)

    if (todosToDelete.length > 0)
      await deleteTodos(todosToDelete, userId)

    const todosToUpdate = []
    for (const todo of selectedTodos)
      todosToUpdate.push(todo.id)

    if (todosToUpdate.length > 0) {
      await $fetch('/api/todos/update-expiration', {
        method: 'PUT',
        body: {
          todoIds: todosToUpdate,
        },
      })
    }

    todos.value = [...todos.value, ...selectedTodos]

    outDatedTodos.value = []
    todos.value = [...todos.value]
  }

  const updateTodoText = async (newText: string, todoId: number) => {
    const updatedTodo = await $fetch('/api/todos/update-text', {
      method: 'PUT',
      body: {
        newText,
        todoId,
      },
    })
    const todoToUpdate = todos.value.find(todo => todo.id === todoId)
    if (todoToUpdate)
      todoToUpdate.text = newText
    return updatedTodo
  }

  return { todos, outDatedTodos, addTodo, deleteTodos, getAllTodos, checkForOutdatedTodos, toggleCompleteTodo, toggleSelectedTodo, handleExpiredTodos, updateTodoText }
})
