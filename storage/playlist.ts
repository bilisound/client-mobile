import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";

export const PLAYLIST_INDEX_KEY = "playlist_index";

export const PLAYLIST_ITEM_KEY_PREFIX = "playlist_item_";

export interface PlaylistMeta {
    id: string;
    title: string;
    color: string;
    amount: number;
}

export interface PlaylistDetailRow {
    id: string;
    bvid: string;
    episode: number;
    title: string;
    duration: number;
}

export const playlistStorage = new MMKVLoader().withInstanceID("storage-playlist").initialize();

export function usePlaylistStorage() {
    return useMMKVStorage<PlaylistMeta[]>(PLAYLIST_INDEX_KEY, playlistStorage, []);
}
