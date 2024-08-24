import { and, eq, count as countFunc, InferInsertModel } from "drizzle-orm";

import { db } from "~/storage/sqlite/main";
import { playlistDetail, playlistMeta } from "~/storage/sqlite/schema";

// 歌单元数据部分

export async function getPlaylistMetas() {
    return db.select().from(playlistMeta);
}

export async function getPlaylistMeta(id: number) {
    return db.select().from(playlistMeta).where(eq(playlistMeta.id, id));
}

export async function deletePlaylistMeta(id: number) {
    return db.delete(playlistMeta).where(eq(playlistMeta.id, id));
}

export async function setPlaylistMeta(meta: Partial<InferInsertModel<typeof playlistMeta>> & { id: number }) {
    return db.update(playlistMeta).set(meta).where(eq(playlistMeta.id, meta.id));
}

// 歌单列表部分

export async function getPlaylistDetail(playlistId: number) {
    return db.select().from(playlistDetail).where(eq(playlistDetail.playlistId, playlistId));
}

export async function deletePlaylistDetail(playlistId: number, id: number) {
    return db.delete(playlistDetail).where(and(eq(playlistDetail.playlistId, playlistId), eq(playlistDetail.id, id)));
}

export async function syncPlaylistAmount(playlistId: number) {
    const countResponse = await db
        .select({ count: countFunc() })
        .from(playlistDetail)
        .where(eq(playlistDetail.playlistId, playlistId));
    const amount = countResponse[0].count;
    await setPlaylistMeta({
        id: playlistId,
        amount,
    });
}
