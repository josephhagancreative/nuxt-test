import { eq } from 'drizzle-orm'
import { db } from '~/drizzle'
import { user } from '~/drizzle/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (body.updatedName) {
    const [updatedUser] = await db.update(user).set({ name: body.updatedName }).where(eq(user.id, body.userId)).returning()
    return updatedUser
  }
  else if (body.todoCompleted) {
    const fetchedUser = await db.query.user.findFirst({
      where: eq(user.id, body.userId),
    })

    if (fetchedUser && body.setCompleted === 1) {
      const [updatedUserWithTotal] = await db.update(user).set({ completedTodos: fetchedUser.completedTodos! + 1 }).where(eq(user.id, body.userId)).returning()
      if (updatedUserWithTotal)
        return updatedUserWithTotal
    }
    else {
      if (fetchedUser && body.setCompleted === 0) {
        const [updatedUserWithTotal] = await db.update(user).set({ completedTodos: fetchedUser.completedTodos! - 1 }).where(eq(user.id, body.userId)).returning()
        if (updatedUserWithTotal)
          return updatedUserWithTotal
      }
    }
  }
})
