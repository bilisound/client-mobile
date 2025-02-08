import { parse } from "smol-toml";
import {
    PlaylistDetailInsert,
    PlaylistImport,
    playlistImportSchema,
    PlaylistMetaInsert,
} from "~/storage/sqlite/schema";

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
}
