import { db } from '~/drizzle'
import { todo } from '~/drizzle/schema'
import { createExpirationDate } from '~/utils/createExpirationDate'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const [insertedTodo] = await db
    .insert(todo)
    .values({
      text: body.text,
      userId: body.userId,
      expirationDate: createExpirationDate(),
    })
    .returning()
  return insertedTodo
})
