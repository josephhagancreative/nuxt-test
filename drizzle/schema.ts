import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'

export const todo = pgTable('todo', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  isComplete: boolean('is_complete').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  userId: integer('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const user = pgTable('user', {
  id: serial('id'),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  completedTodos: integer('completed_todos').default(0),
  amountOfCarryOverTodos: integer('amount_of_carryover_todos').default(3),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const todoRelations = relations(todo, ({ one }) => ({
  user: one(user, {
    fields: [todo.userId],
    references: [user.id],
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  todos: many(todo),
}))

export const todoInsertSchema = createInsertSchema(todo)
export const todoSelectSchema = createSelectSchema(todo)
export type Todo = z.infer<typeof todoSelectSchema>
export type OutdatedTodo = Todo & {
  selected: boolean
}

export const userInsertSchema = createInsertSchema(user)
export const userSelectSchema = createSelectSchema(user)
export type User = z.infer<typeof userSelectSchema>
