import { eq } from 'drizzle-orm'
import { db } from '~/drizzle'
import { todo } from '~/drizzle/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const todos = await db.select().from(todo).where(eq(todo.userId, query.userId! as number))
  return todos
})
