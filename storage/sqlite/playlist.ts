import { and, eq, count as countFunc, InferInsertModel } from "drizzle-orm";

import { db } from "~/storage/sqlite/main";
import { PlaylistDetail, playlistDetail, playlistMeta } from "~/storage/sqlite/schema";

// ============================================================================
// 歌单元数据部分
// ============================================================================

/**
 * 查询歌单元数据列表
 */
export async function getPlaylistMetas() {
    return db.select().from(playlistMeta);
}

/**
 * 查询歌单元数据
 * @param id
 */
export async function getPlaylistMeta(id: number) {
    return db.select().from(playlistMeta).where(eq(playlistMeta.id, id));
}

/**
 * 删除歌单元数据
 * @param id
 */
export async function deletePlaylistMeta(id: number) {
    return db.delete(playlistMeta).where(eq(playlistMeta.id, id));
}

/**
 * 修改歌单元数据
 * @param meta
 */
export async function setPlaylistMeta(meta: Partial<InferInsertModel<typeof playlistMeta>> & { id: number }) {
    return db.update(playlistMeta).set(meta).where(eq(playlistMeta.id, meta.id));
}

// ============================================================================
// 歌单列表部分
// ============================================================================

/**
 * 获取歌单列表
 * @param playlistId
 */
export async function getPlaylistDetail(playlistId: number) {
    return db.select().from(playlistDetail).where(eq(playlistDetail.playlistId, playlistId));
}

/**
 * 插入歌单列表项
 * @param data
 */
export async function insertPlaylistDetail(data: InferInsertModel<typeof playlistDetail>) {
    return db.insert(playlistDetail).values(data);
}

/**
 * 删除歌单列表项
 * @param playlistId
 * @param id
 */
export async function deletePlaylistDetail(playlistId: number, id: number) {
    return db.delete(playlistDetail).where(and(eq(playlistDetail.playlistId, playlistId), eq(playlistDetail.id, id)));
}

// ============================================================================
// 复杂操作部分
// ============================================================================

/**
 * 添加一首或多首曲目到已有的播放列表
 * @param playlistId
 * @param playlist
 */
export async function addToPlaylist(playlistId: number, playlist: PlaylistDetail | PlaylistDetail[]) {
    const parsedPlaylist = (Array.isArray(playlist) ? playlist : [playlist]).map(e => ({ ...e, playlistId }));
    await db.insert(playlistDetail).values(parsedPlaylist);
}

/**
 * 同步指定播放列表的曲目数量
 * @param playlistId
 */
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

/**
 * 从多首曲目快速创建新的播放列表
 * @param name
 * @param list
 */
export async function quickCreatePlaylist(name: string, list: PlaylistDetail[]) {
    // 在 playlistMeta 表中创建新的播放列表
    const newPlaylist = await db
        .insert(playlistMeta)
        .values({
            title: name,
            color:
                "#" +
                Math.floor(Math.random() * 16777216)
                    .toString(16)
                    .padStart(6, "0"), // 生成随机颜色
            amount: list.length,
            createFromQueue: 0,
        })
        .returning();

    const playlistId = newPlaylist[0].id;

    // 将 list 中的数据插入到 playlistDetail 表
    const builtList = list.map(e => ({ ...e, playlistId }));
    await db.insert(playlistDetail).values(builtList);

    return playlistId;
}
