import process from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export const connection = postgres(
  process.env.DB_URL!,
  {
    max: 1,
  },
)

export const db = drizzle(connection, {
  schema,
  logger: true,
})
