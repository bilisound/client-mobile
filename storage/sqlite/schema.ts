import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 定义 playlist_meta 表
export const playlistMeta = sqliteTable("playlist_meta", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    color: text("color").notNull(),
    amount: integer("amount").notNull(),
});

// 定义 playlist_detail 表
export const playlistDetail = sqliteTable("playlist_detail", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    playlistId: integer("playlist_id")
        .notNull()
        .references(() => playlistMeta.id),
    author: text("author").notNull(),
    bvid: text("bvid").notNull(),
    duration: integer("duration").notNull(),
    episode: integer("episode").notNull(),
    title: text("title").notNull(),
    imgUrl: text("img_url").notNull(),
});

export type PlaylistMeta = InferSelectModel<typeof playlistMeta>;

export type PlaylistDetail = InferSelectModel<typeof playlistDetail>;
