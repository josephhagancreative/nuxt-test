import { eq, inArray } from 'drizzle-orm'
import { db } from '~/drizzle'
import { todo } from '~/drizzle/schema'
import { createExpirationDate } from '~/utils/createExpirationDate'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const [updatedTodo] = await db.update(todo).set({ text: body.newText }).where(eq(todo.id, body.todoId)).returning()

  return updatedTodo
})
