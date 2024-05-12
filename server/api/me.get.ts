import { eq } from 'drizzle-orm'
import { getServerSession } from '#auth'
import { db } from '~/drizzle'
import { user } from '~/drizzle/schema'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session?.user)
    return createError({ status: 404, message: 'Error' })

  const fetchedUser = await db.query.user.findFirst({
    where: eq(user.email, session.user.email!),
  })

  if (!fetchedUser) {
    const [createdUser] = await db.insert(user).values({
      email: session.user.email!,
      name: session.user.name!,
    }).returning()
    return createdUser
  }
  return fetchedUser
})
