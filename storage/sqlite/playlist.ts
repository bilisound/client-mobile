import { eq } from "drizzle-orm";

import { db } from "~/storage/sqlite/main";
import { playlistMeta } from "~/storage/sqlite/schema";

export function getPlaylistMetas() {
    return db.select().from(playlistMeta);
}

export function getPlaylistMeta(id: number) {
    return db.select().from(playlistMeta).where(eq(playlistMeta.id, id));
}

export function deletePlaylistMeta(id: number) {
    return db.delete(playlistMeta).where(eq(playlistMeta.id, id));
}
