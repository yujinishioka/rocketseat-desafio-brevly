import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";

export const uploads = pgTable('uploads', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  url: text('url').notNull(),
  remoteKey: text('remote_key').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});