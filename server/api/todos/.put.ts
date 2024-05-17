import { eq } from 'drizzle-orm'
import { db } from '~/drizzle'
import { todo } from '~/drizzle/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const [updatedTodo] = await db.update(todo).set({ isComplete: body.isComplete }).where(eq(todo.id, body.todoId)).returning()

  return updatedTodo
})
