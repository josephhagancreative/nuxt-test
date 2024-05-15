import { eq, inArray } from 'drizzle-orm'
import { db } from '~/drizzle'
import { todo } from '~/drizzle/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const [updatedTodo] = await db.update(todo).set({ updatedAt: new Date() }).where(inArray(todo.id, body.todoIds)).returning()

  return updatedTodo
})
