import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";

import log from "../utils/logger";

export const PLAYLIST_INDEX_KEY = "playlist_index";

export const PLAYLIST_ITEM_KEY_PREFIX = "playlist_item_";

export const PLAYLIST_LAST_USED = "playlist_last_used";

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
    return useMMKVStorage<PlaylistMeta | undefined>(PLAYLIST_LAST_USED, playlistStorage, undefined);
}

export function addToPlaylist(id: string, row: PlaylistDetailRow | PlaylistDetailRow[]) {
    const list = Array.isArray(row) ? row : [row];
    log.debug(`添加 ${list.length} 首歌曲到歌单 ${id}`);

    const originalList = playlistStorage.getArray<PlaylistDetailRow>(PLAYLIST_ITEM_KEY_PREFIX + id) || [];
    originalList.push(...list);
    playlistStorage.setArray(PLAYLIST_ITEM_KEY_PREFIX + id, originalList);
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
