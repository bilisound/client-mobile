import { PlaylistDetail, PlaylistDetailInsert, PlaylistImport, PlaylistMetaInsert } from "./schema";

import { PlaylistSource } from "~/typings/playlist";

// ============================================================================
// 歌单元数据部分
// ============================================================================

/**
 * 查询歌单元数据列表
 */
export async function getPlaylistMetas(filterHasSource = false) {
    return [];
}

/**
 * 查询歌单元数据
 * @param id
 */
export async function getPlaylistMeta(id: number) {
    return [];
}

/**
 * 删除歌单元数据
 * @param id
 */
export async function deletePlaylistMeta(id: number) {}

/**
 * 修改歌单元数据
 * @param meta
 */
export async function setPlaylistMeta(meta: Partial<PlaylistMetaInsert> & { id: number }) {}

/**
 * 插入歌单元数据
 * @param meta
 */
export async function insertPlaylistMeta(meta: PlaylistMetaInsert) {}

// ============================================================================
// 歌单列表部分
// ============================================================================

/**
 * 获取歌单列表
 * @param playlistId
 */
export async function getPlaylistDetail(playlistId: number) {
    return [];
}

/**
 * 插入歌单列表项
 * @param data
 */
export async function insertPlaylistDetail(data: PlaylistDetailInsert) {}

/**
 * 删除歌单列表项
 * @param id
 */
export async function deletePlaylistDetail(id: number) {}

// ============================================================================
// 复杂操作部分
// ============================================================================

/**
 * 添加一首或多首曲目到已有的播放列表
 * @param playlistId
 * @param playlist
 */
export async function addToPlaylist(playlistId: number, playlist: PlaylistDetailInsert[]) {}

/**
 * 用另一个列表替换已有列表中的内容
 * @param playlistId
 * @param playlist
 */
export async function replacePlaylist(playlistId: number, playlist: PlaylistDetailInsert[]) {}

/**
 * 同步指定播放列表的曲目数量
 * @param playlistId
 */
export async function syncPlaylistAmount(playlistId: number) {}

/**
 * 用另一个播放列表详情完全替换播放列表
 * @param playlistId
 * @param playlist
 */
export function replacePlaylistDetail(playlistId: number, playlist: PlaylistDetailInsert[]) {}

/**
 * 从多首曲目快速创建新的播放列表
 * @param title
 * @param description
 * @param list
 * @param source
 * @param imgUrl
 */
export async function quickCreatePlaylist(
    title: string,
    description: string,
    list: PlaylistDetail[],
    source?: PlaylistSource,
    imgUrl?: string,
) {}

/**
 * 导出播放列表
 * @param id
 */
export async function exportPlaylist(id: number): Promise<PlaylistImport> {
    return {
        meta: [],
        detail: [],
        kind: "moe.bilisound.app.exportedPlaylist",
        version: 1,
    };
}

/**
 * 导出全部播放列表
 */
export async function exportAllPlaylist(): Promise<PlaylistImport> {
    return {
        meta: [],
        detail: [],
        kind: "moe.bilisound.app.exportedPlaylist",
        version: 1,
    };
}

/**
 * 克隆播放列表
 */
export async function clonePlaylist(playlistId: number) {}

/**
 * 删除全部歌单
 */
export async function deleteAllPlaylist() {}
