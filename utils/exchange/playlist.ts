import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { parse, stringify } from "smol-toml";

import { exportPlaylist } from "~/storage/sqlite/playlist";
import { saveTextFile } from "~/utils/file";
import log from "~/utils/logger";

export async function exportPlaylistToFile(id: number) {
    const output = await exportPlaylist(id);
    const doc = stringify(output);
    await saveTextFile("[Bilisound 歌单] " + meta[0].title + ".toml", doc, "application/toml");
}

export async function importPlaylistFromFile() {
    const pickResult = await DocumentPicker.getDocumentAsync({
        type: ["application/*"],
    });
    const uri = pickResult.assets?.[0].uri;
    log.info(`用户导入歌单：${pickResult.assets?.[0].uri}`);
    try {
        // const parsed = parse(await FileSystem.readAsStringAsync());
    } catch (e) {}
}
