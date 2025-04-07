import * as FileSystem from "expo-file-system";
import {
    LEGACY_PLAYLIST_INDEX_KEY,
    LEGACY_PLAYLIST_ITEM_KEY_PREFIX,
    LegacyPlaylistMeta,
    playlistStorage,
} from "~/storage/playlist";
import log from "~/utils/logger";

const PLAYLIST_V0_BACKUP_URI = FileSystem.documentDirectory + "migration_backup/playlist_v0";

export async function mayBackupLegacyPlaylist() {
    const got = playlistStorage.getString(LEGACY_PLAYLIST_INDEX_KEY);
    if (got) {
        log.info("发现旧版数据，正在备份……");
        await FileSystem.makeDirectoryAsync(PLAYLIST_V0_BACKUP_URI);
        await FileSystem.writeAsStringAsync(`${PLAYLIST_V0_BACKUP_URI}/index.json`, got);
        const index: LegacyPlaylistMeta[] = JSON.parse(got);

        // 遍历歌单 index，备份单个歌单
        for (let i = 0; i < index.length; i++) {
            const e = index[i];
            await FileSystem.writeAsStringAsync(
                `${PLAYLIST_V0_BACKUP_URI}/${e.id}.json`,
                playlistStorage.getString(LEGACY_PLAYLIST_ITEM_KEY_PREFIX + e.id) || "[]",
            );
        }
    }
}
