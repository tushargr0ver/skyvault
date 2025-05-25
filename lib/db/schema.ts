import { integer, pgTable, varchar,uuid,timestamp } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    filePath: varchar("file_path", { length: 1024 }).notNull(),
    size: integer("size").notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const storage = pgTable("storage", {
    userId: varchar("user_id", { length: 255 }).notNull().primaryKey(),
    usedStorage: integer("used_storage").default(0),
    totalFiles: integer("total_files").default(0)
});