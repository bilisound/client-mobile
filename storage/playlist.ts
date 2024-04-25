import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
import { v4 } from "uuid";

import log from "../utils/logger";

export const PLAYLIST_INDEX_KEY = "playlist_index";

export const PLAYLIST_ITEM_KEY_PREFIX = "playlist_item_";

export const PLAYLIST_LAST_USED = "playlist_last_used";

export const PLAYLIST_ON_QUEUE = "playlist_on_queue";

export interface PlaylistMeta {
    id: string;
    title: string;
    color: string;
    amount: number;
}

export interface PlaylistDetailRow {
    author: string;
    bvid: string;
    duration: number;
    episode: number;
    title: string;
    imgUrl: string;
}

export const playlistStorage = new MMKVLoader().withInstanceID("storage-playlist").initialize();

export function usePlaylistStorage() {
    return useMMKVStorage<PlaylistMeta[]>(PLAYLIST_INDEX_KEY, playlistStorage, []);
}

export function usePlaylistLastUsed() {
    return useMMKVStorage<Partial<PlaylistMeta>>(PLAYLIST_LAST_USED, playlistStorage, {});
}

export function usePlaylistOnQueue() {
    return useMMKVStorage<Partial<PlaylistMeta>>(PLAYLIST_ON_QUEUE, playlistStorage, {});
}

export function addToPlaylist(id: string, row: PlaylistDetailRow | PlaylistDetailRow[]) {
    const list = Array.isArray(row) ? row : [row];
    log.debug(`添加 ${list.length} 首歌曲到歌单 ${id}`);

    const originalList = playlistStorage.getArray<PlaylistDetailRow>(PLAYLIST_ITEM_KEY_PREFIX + id) || [];
    originalList.push(...list);
    playlistStorage.setArray(PLAYLIST_ITEM_KEY_PREFIX + id, originalList);
}

export function quickCreatePlaylist(title: string, row: PlaylistDetailRow | PlaylistDetailRow[]) {
    const list = Array.isArray(row) ? row : [row];
    const item: PlaylistMeta = {
        id: v4(),
        color: `hsl(${Math.random() * 360}, 80%, 50%)`,
        title,
        amount: list.length,
    };
    log.info(`快速创建歌单 ${title} (${item.id})`);
    const originalList = playlistStorage.getArray<PlaylistMeta>(PLAYLIST_INDEX_KEY) || [];
    originalList.push(item);
    playlistStorage.setArray(PLAYLIST_INDEX_KEY, originalList);

    log.info(`添加曲目到快速创建的歌单 ${item.id}`);
    addToPlaylist(item.id, list);
}

export function syncPlaylistAmount(id: string) {
    log.debug(`对歌单 ${id} 进行同步曲目数量操作`);
    const playlistMetas = playlistStorage.getArray<PlaylistMeta>(PLAYLIST_INDEX_KEY) || [];
    const playlistData = playlistStorage.getArray<PlaylistDetailRow>(PLAYLIST_ITEM_KEY_PREFIX + id) || [];

    const len = playlistData.length;
    const foundIndex = playlistMetas.findIndex(e => e.id === id);
    if (foundIndex < 0) {
        log.error(`无法找到要同步曲目数量的歌单 ${id}（可能是脏数据）。`);
        return;
    }
    playlistMetas[foundIndex].amount = len;

    playlistStorage.setArray(PLAYLIST_INDEX_KEY, playlistMetas);
}
