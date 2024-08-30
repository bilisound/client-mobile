import { sql } from "drizzle-orm";
import RNFS from "react-native-fs";

import log from "../logger";

import {
    LEGACY_PLAYLIST_INDEX_KEY,
    LEGACY_PLAYLIST_ITEM_KEY_PREFIX,
    LegacyPlaylistDetailRow,
    LegacyPlaylistMeta,
    PLAYLIST_DB_VERSION,
    playlistStorage,
} from "~/storage/playlist";
import { db } from "~/storage/sqlite/main";
import { playlistDetail, playlistMeta } from "~/storage/sqlite/schema";

const PLAYLIST_V0_BACKUP_PATH = RNFS.DocumentDirectoryPath + "/migration_backup/playlist_v0";

export async function handlePlaylist(forceVersion?: number) {
    const version = forceVersion ?? (playlistStorage.getNumber(PLAYLIST_DB_VERSION) || 0);

    log.info(`当前数据库版本：${version}`);

    // 版本为 0：首次使用 Bilisound 或从 1.5.0 以下版本升级上来，需要创建数据库，并且导入存在 MMKV 中的旧版歌单数据
    if (version <= 0) {
        log.info("正在执行 v0 -> v2 升级程序……");

        // 备份旧数据
        const got = playlistStorage.getString(LEGACY_PLAYLIST_INDEX_KEY);
        if (got) {
            log.info("发现旧版数据，正在备份……");
            await RNFS.mkdir(PLAYLIST_V0_BACKUP_PATH);
            await RNFS.writeFile(`${PLAYLIST_V0_BACKUP_PATH}/index.json`, got);
            const index: LegacyPlaylistMeta[] = JSON.parse(got);

            // 遍历歌单 index，备份单个歌单
            for (let i = 0; i < index.length; i++) {
                const e = index[i];
                await RNFS.writeFile(
                    `${PLAYLIST_V0_BACKUP_PATH}/${e.id}.json`,
                    playlistStorage.getString(LEGACY_PLAYLIST_ITEM_KEY_PREFIX + e.id) || "[]",
                );
            }
        }

        log.info("正在创建数据库……");
        db.transaction(tx => {
            tx.run(sql`
                CREATE TABLE \`playlist_detail\`
                (
                    \`id\`            integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    \`playlist_id\`   integer NOT NULL,
                    \`author\`        text    NOT NULL,
                    \`bvid\`          text    NOT NULL,
                    \`duration\`      integer NOT NULL,
                    \`episode\`       integer NOT NULL,
                    \`title\`         text    NOT NULL,
                    \`img_url\`       text    NOT NULL,
                    \`extended_data\` text,
                    FOREIGN KEY (\`playlist_id\`) REFERENCES \`playlist_meta\` (\`id\`) ON UPDATE no action ON DELETE no action
                );
            `);
            tx.run(sql`
                CREATE TABLE \`playlist_meta\`
                (
                    \`id\`            integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    \`title\`         text    NOT NULL,
                    \`color\`         text    NOT NULL,
                    \`amount\`        integer NOT NULL,
                    \`img_url\`       text,
                    \`description\`   text,
                    \`source\`        text,
                    \`extended_data\` text
                );
            `);

            // 准备歌单 index
            log.info("正在迁移歌单数据……");
            const index: LegacyPlaylistMeta[] = JSON.parse(
                playlistStorage.getString(LEGACY_PLAYLIST_INDEX_KEY) || "[]",
            );
            playlistStorage.delete(LEGACY_PLAYLIST_INDEX_KEY);

            // 遍历歌单 index，插入到 SQLite 中，并处理歌单列表
            index.forEach(e => {
                log.info(`正在迁移歌单「${e.title}」……`);
                const { lastInsertRowId: playlistId } = tx
                    .insert(playlistMeta)
                    .values({ title: e.title, color: e.color, amount: e.amount })
                    .run();
                const detail: LegacyPlaylistDetailRow[] = JSON.parse(
                    playlistStorage.getString(LEGACY_PLAYLIST_ITEM_KEY_PREFIX + e.id) || "[]",
                );
                playlistStorage.delete(LEGACY_PLAYLIST_ITEM_KEY_PREFIX + e.id);

                // 插入歌单歌曲项
                detail.forEach(f => {
                    tx.insert(playlistDetail)
                        .values({
                            author: f.author,
                            bvid: f.bvid,
                            duration: f.duration,
                            episode: f.episode,
                            imgUrl: f.imgUrl,
                            title: f.title,
                            playlistId,
                        })
                        .run();
                });
            });
        });

        log.info(`升级完毕，将数据库版本设置为 2`);
        playlistStorage.set(PLAYLIST_DB_VERSION, 2);
    }

    if (version === 1) {
        log.info("正在执行 v1 -> v2 升级程序……");

        db.transaction(tx => {
            tx.run(sql`ALTER TABLE \`playlist_detail\`
                ADD \`extended_data\` text;`);
            tx.run(sql`ALTER TABLE \`playlist_meta\` ADD \`img_url\` text;`);
            tx.run(sql`ALTER TABLE \`playlist_meta\`
                ADD \`description\` text;`);
            tx.run(sql`ALTER TABLE \`playlist_meta\`
                ADD \`source\` text;`);
            tx.run(sql`ALTER TABLE \`playlist_meta\`
                ADD \`extended_data\` text;`);
        });

        log.info(`升级完毕，将数据库版本设置为 2`);
        playlistStorage.set(PLAYLIST_DB_VERSION, 2);
    }
}
