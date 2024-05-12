import { and, eq } from 'drizzle-orm'
import { db } from '~/drizzle'
import { todo } from '~/drizzle/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const [deletedTodo] = await db.delete(todo).where(and(eq(todo.id, body.todoId), eq(todo.userId, body.userId)))
  return deletedTodo
})
