import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { stringify } from "smol-toml";

import { exportAllPlaylist, exportPlaylist } from "~/storage/sqlite/playlist";

import { saveTextFile } from "~/utils/file";
import log from "~/utils/logger";
import Toast from "react-native-toast-message";
import { importHelper } from "~/utils/exchange/import-helper";

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
    const fileName = `[Bilisound 歌单] ${name}.toml`;
    await saveTextFile(fileName, doc, "application/toml");
    Toast.show({
        type: "success",
        text1: "文件已保存",
        text2: fileName,
    });
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
        importHelper(await FileSystem.readAsStringAsync(uri, { encoding: "utf8" }));
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
