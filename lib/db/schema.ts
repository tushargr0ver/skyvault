import { integer, pgTable, varchar,uuid,timestamp } from "drizzle-orm/pg-core";

export const storage = pgTable("storage", {
    userId: varchar("user_id", { length: 255 }).notNull().primaryKey(),
    usedStorage: integer("used_storage").default(0),
    totalFiles: integer("total_files").default(0)
});