import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 定义 playlist_meta 表
export const PlaylistMeta = sqliteTable("playlist_meta", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    color: text("color").notNull(),
    amount: integer("amount").notNull(),
    createFromQueue: integer("create_from_queue"),
});

// 定义 playlist_detail 表
export const PlaylistDetail = sqliteTable("playlist_detail", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    playlistId: integer("playlist_id")
        .notNull()
        .references(() => PlaylistMeta.id),
    author: text("author").notNull(),
    bvid: text("bvid").notNull(),
    duration: integer("duration").notNull(),
    episode: integer("episode").notNull(),
    title: text("title").notNull(),
    imgUrl: text("img_url").notNull(),
});
