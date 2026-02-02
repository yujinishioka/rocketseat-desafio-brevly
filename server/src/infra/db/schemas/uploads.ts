import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const uploads = pgTable('uploads', {
  id: text('id').primaryKey().$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  url: text('url').notNull(),
  access: integer('access').notNull().default(0),
  remoteKey: text('remote_key').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});