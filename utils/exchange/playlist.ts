import { InferInsertModel } from "drizzle-orm";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import { parse, stringify } from "smol-toml";

import { db } from "~/storage/sqlite/main";
import { exportAllPlaylist, exportPlaylist } from "~/storage/sqlite/playlist";
import { playlistDetail, playlistImportSchema, playlistMeta } from "~/storage/sqlite/schema";
import { saveTextFile } from "~/utils/file";
import log from "~/utils/logger";

export async function exportPlaylistToFile(id?: number) {
    let output;
    let name;
    if (typeof id === "number") {
        output = await exportPlaylist(id);
    } else {
        output = await exportAllPlaylist();
    }
    const doc = stringify(output);
    if (output.meta.length > 1) {
        name = output.meta.length + " 个歌单导出";
    } else {
        name = output.meta[0].title;
    }
    const ok = await saveTextFile("[Bilisound 歌单] " + name + ".toml", doc, "application/toml");
    if (ok) {
        Toast.show({
            type: "success",
            text1: "操作成功",
            text2: `成功导出 ${output.meta.length} 个歌单`,
        });
    }
}

interface MigratePlan {
    meta: InferInsertModel<typeof playlistMeta>;
    detail: InferInsertModel<typeof playlistDetail>[];
}

export async function importPlaylistFromFile() {
    const pickResult = await DocumentPicker.getDocumentAsync({
        // type: ["application/*"],
    });
    const uri = pickResult.assets?.[0].uri;
    if (!uri) {
        log.info(`pickResult 没有返回路径：${JSON.stringify(pickResult)}`);
        return false;
    }
    try {
        log.info(`用户导入歌单：${pickResult.assets?.[0].uri}`);
        const parsed = parse(await FileSystem.readAsStringAsync(uri, { encoding: "utf8" }));
        const validationResult = playlistImportSchema.parse(parsed);
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
        db.transaction(tx => {
            for (let i = 0; i < migratePlan.length; i++) {
                const e = migratePlan[i];
                const { lastInsertRowId } = tx
                    .insert(playlistMeta)
                    .values({ ...e.meta, amount: e.detail.length, id: undefined })
                    .run();
                for (let j = 0; j < e.detail.length; j++) {
                    const f = e.detail[j];
                    tx.insert(playlistDetail)
                        .values({ ...f, id: undefined, playlistId: lastInsertRowId })
                        .run();
                }
            }
        });
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
