import Toast from "react-native-toast-message";
import log from "~/utils/logger";
import { importHelper } from "~/utils/exchange/import-helper";
import { addToPlaylist, insertPlaylistMeta } from "~/storage/sqlite/playlist";

export async function exportPlaylistToFile(id?: number) {}

function readPlaylistFromFile() {
    return new Promise<string>((resolve, reject) => {
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
                    el.remove();
                    resolve(content);
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
        const migratePlan = importHelper(await readPlaylistFromFile());
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
