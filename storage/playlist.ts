import { MMKV, useMMKVObject } from "react-native-mmkv";

import { PlaylistMeta } from "~/storage/sqlite/schema";

export const PLAYLIST_INDEX_KEY = "playlist_index";

export const PLAYLIST_ITEM_KEY_PREFIX = "playlist_item_";

export const PLAYLIST_ON_QUEUE = "playlist_on_queue";

export interface PlaylistMetaLegacy {
    id: string;
    title: string;
    color: string;
    amount: number;
    createFromQueue?: boolean;
}

export interface PlaylistDetailRowLegacy {
    author: string;
    bvid: string;
    duration: number;
    episode: number;
    title: string;
    imgUrl: string;
}

export const playlistStorage = new MMKV({ id: "storage-playlist" });

export function usePlaylistOnQueue() {
    return useMMKVObject<{ value?: PlaylistMeta | undefined }>(PLAYLIST_ON_QUEUE, playlistStorage);
}

export function invalidateOnQueueStatus() {
    playlistStorage.set(PLAYLIST_ON_QUEUE, "{}");
}
