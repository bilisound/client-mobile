import { parse } from "smol-toml";
import {
    playlistDetail,
    PlaylistDetailInsert,
    PlaylistImport,
    playlistImportSchema,
    playlistMeta,
    PlaylistMetaInsert,
} from "~/storage/sqlite/schema";
import { addToPlaylist, insertPlaylistMeta } from "~/storage/sqlite/playlist";
import Toast from "react-native-toast-message";
import log from "~/utils/logger";

export async function exportPlaylistToFile(id?: number) {}

interface MigratePlan {
    meta: PlaylistMetaInsert;
    detail: PlaylistDetailInsert[];
}

function readPlaylistFromFile() {
    return new Promise<PlaylistImport>((resolve, reject) => {
        const el = document.createElement("input");
        el.type = "file";
        el.accept = ".toml";
        el.onchange = event => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) {
                reject(new Error("No file selected"));
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const content = reader.result as string;
                    const parsed = parse(content);
                    const validationResult = playlistImportSchema.parse(parsed);
                    el.remove();
                    resolve(validationResult);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.readAsText(file);
        };
        el.click();
    });
}

export async function importPlaylistFromFile() {
    try {
        const validationResult = await readPlaylistFromFile();
        const migratePlan: MigratePlan[] = [];
        for (let i = 0; i < validationResult.meta.length; i++) {
            const meta = validationResult.meta[i];
            const detail = validationResult.detail
                .filter(e => String(e.playlistId) === String(meta.id)) // 存量数据兼容处理
                .map(e => ({ ...e, playlistId: -1 }));
            migratePlan.push({
                meta,
                detail,
            });
        }
        for (let i = 0; i < migratePlan.length; i++) {
            const e = migratePlan[i];
            const { lastInsertRowId } = await insertPlaylistMeta({ ...e.meta, amount: e.detail.length });
            await addToPlaylist(
                lastInsertRowId,
                e.detail.map(f => ({ ...f, playlistId: lastInsertRowId })),
            );
        }
        Toast.show({
            type: "success",
            text1: "歌单导入成功",
            text2: `导入了 ${migratePlan.length} 个歌单`,
        });
    } catch (e) {
        log.error(`歌单导入失败：${e}`);
        Toast.show({
            type: "error",
            text1: "歌单导入失败",
            text2: "无法读取选择的文件",
        });
        if (process.env.NODE_ENV !== "production") {
            throw e;
        }
    }
    return true;
}
