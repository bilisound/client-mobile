import { MMKV, useMMKVObject } from "react-native-mmkv";
import { v4 } from "uuid";

import log from "../utils/logger";

export const PLAYLIST_INDEX_KEY = "playlist_index";

export const PLAYLIST_ITEM_KEY_PREFIX = "playlist_item_";

// export const PLAYLIST_LAST_USED = "playlist_last_used";

export const PLAYLIST_ON_QUEUE = "playlist_on_queue";

export interface PlaylistMeta {
    id: string;
    title: string;
    color: string;
    amount: number;
    createFromQueue?: boolean;
}

export interface PlaylistDetailRow {
    author: string;
    bvid: string;
    duration: number;
    episode: number;
    title: string;
    imgUrl: string;
}

export const playlistStorage = new MMKV({ id: "storage-playlist" });

export function usePlaylistStorage() {
    return useMMKVObject<PlaylistMeta[]>(PLAYLIST_INDEX_KEY, playlistStorage);
}

/*export function usePlaylistLastUsed() {
    return useMMKVStorage<Partial<PlaylistMeta>>(PLAYLIST_LAST_USED, playlistStorage, {});
}*/

export function usePlaylistOnQueue() {
    return useMMKVObject<{ value?: PlaylistMeta | undefined }>(PLAYLIST_ON_QUEUE, playlistStorage);
}

export function invalidateOnQueueStatus() {
    playlistStorage.set(PLAYLIST_ON_QUEUE, "{}");
}

const hslRegex = /hsl\((\d+\.?\d*)/;

/**
 * 获取伪随机颜色。从列表中找出出现次数最少的色相，然后返回属于该色相的颜色。
 */
export function getNewColor() {
    const originalList: PlaylistMeta[] = JSON.parse(playlistStorage.getString(PLAYLIST_INDEX_KEY) || "[]");
    const colors = originalList.map(e => Math.floor(Number(hslRegex.exec(e.color)?.[1] ?? "0") / 60));
    const occurrences = colors.reduce<Record<string, number>>(
        function (acc, curr) {
            if (acc[curr]) {
                ++acc[curr];
            } else {
                acc[curr] = 1;
            }
            return acc;
        },
        { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    );
    let leastKey = "0";
    let leastValue = Infinity;
    for (const [key, value] of Object.entries(occurrences)) {
        if (value < leastValue) {
            leastValue = value;
            leastKey = key;
        }
    }
    return `hsl(${Math.random() * 60 + Number(leastKey) * 60}, 80%, 50%)`;
}

export function addToPlaylist(id: string, row: PlaylistDetailRow | PlaylistDetailRow[]) {
    const list = Array.isArray(row) ? row : [row];
    log.debug(`添加 ${list.length} 首歌曲到歌单 ${id}`);

    const originalList: PlaylistDetailRow[] = JSON.parse(
        playlistStorage.getString(PLAYLIST_ITEM_KEY_PREFIX + id) || "[]",
    );
    originalList.push(...list);
    playlistStorage.set(PLAYLIST_ITEM_KEY_PREFIX + id, JSON.stringify(originalList));

    // 清空当前播放队列隶属歌单的状态机
    const got: { value?: PlaylistMeta } = JSON.parse(playlistStorage.getString(PLAYLIST_ON_QUEUE) || "{}");
    if (got?.value?.id === id) {
        invalidateOnQueueStatus();
    }
}

export function quickCreatePlaylist(title: string, row: PlaylistDetailRow | PlaylistDetailRow[]) {
    const list = Array.isArray(row) ? row : [row];
    const item: PlaylistMeta = {
        id: v4(),
        color: getNewColor(),
        title,
        amount: list.length,
    };
    log.info(`快速创建歌单 ${title} (${item.id})`);
    const originalList: PlaylistMeta[] = JSON.parse(playlistStorage.getString(PLAYLIST_INDEX_KEY) || "[]");
    originalList.push(item);
    playlistStorage.set(PLAYLIST_INDEX_KEY, JSON.stringify(originalList));

    log.info(`添加曲目到快速创建的歌单 ${item.id}`);
    addToPlaylist(item.id, list);
}

export function syncPlaylistAmount(id: string) {
    if (!id) {
        log.debug(`非法操作，id 的值为空`);
        return;
    }
    log.debug(`对歌单 ${id} 进行同步曲目数量操作`);
    const playlistMetas: PlaylistMeta[] = JSON.parse(playlistStorage.getString(PLAYLIST_INDEX_KEY) || "[]");
    const playlistData: PlaylistDetailRow[] = JSON.parse(
        playlistStorage.getString(PLAYLIST_ITEM_KEY_PREFIX + id) || "[]",
    );

    const len = playlistData.length;
    const foundIndex = playlistMetas.findIndex(e => e.id === id);
    if (foundIndex < 0) {
        log.error(`无法找到要同步曲目数量的歌单 ${id}（可能是脏数据）。`);
        return;
    }
    playlistMetas[foundIndex].amount = len;

    playlistStorage.set(PLAYLIST_INDEX_KEY, JSON.stringify(playlistMetas));
}
