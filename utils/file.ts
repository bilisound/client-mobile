import * as Sharing from "expo-sharing";
import path from "path-browserify";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { createDocument } from "react-native-saf-x";
import Toast from "react-native-toast-message";
import TrackPlayer from "react-native-track-player";

import { BILISOUND_OFFLINE_PATH } from "~/constants/file";
import log from "~/utils/logger";

export async function saveTextFile(name: string, content: string, mimeType = "text/plain") {
    if (Platform.OS === "android") {
        log.debug("使用 Android SAF 保存文本文件");
        const response = await createDocument(content, {
            initialName: name,
            encoding: "utf8",
        });
        log.debug("保存文件流程结束");
        return !!response;
    }
    const filePath = RNFS.CachesDirectoryPath + `/shared_text_file_${new Date().getTime()}`;
    const fileFullPath = `${filePath}/${name}`;
    await RNFS.mkdir(filePath);
    await RNFS.writeFile(fileFullPath, content, "utf8");
    log.debug("分享文件：" + fileFullPath);
    await Sharing.shareAsync("file://" + encodeURI(fileFullPath), {
        mimeType,
    });
    log.debug("分享文件流程结束");
}

/**
 * 保存文件到「本地」。iOS 下，分享文件给文件 App；Android 下，通过 StorageAccessFramework 保存到用户路径
 * @param location
 * @param replaceFileName
 */
export async function saveFile(location: string, replaceFileName?: string) {
    log.debug(`尝试保存文件到本地。location: ${location}, replaceFileName: ${replaceFileName}`);
    if (!location.startsWith("file://")) {
        log.warn(`参数 location 必须是 file:// URI。传入的 location: ${location}`);
        location = `file://${encodeURI(location)}`;
    }
    const parsed = path.parse(location);
    const fileName = replaceFileName ?? `${parsed.name}${parsed.ext}`;

    if (Platform.OS === "android") {
        const response = await createDocument(
            await RNFS.readFile(decodeURI(location.slice(7)), { encoding: "base64" }),
            {
                initialName: fileName,
                encoding: "base64",
            },
        );
        if (response) {
            Toast.show({
                type: "success",
                text1: "音频文件已保存",
            });
        }
        return !!response;
    }
    let targetLocation = "";

    if (replaceFileName) {
        targetLocation = `${RNFS.CachesDirectoryPath}/sharing-${new Date().getTime()}/${replaceFileName}`;
        await RNFS.mkdir(path.parse(targetLocation).dir);
        await RNFS.copyFile(decodeURI(location.slice(7)), targetLocation);
    }
    await Sharing.shareAsync(targetLocation ? `file://${encodeURI(targetLocation)}` : location, {
        mimeType: "application/octet-stream",
    });
    if (targetLocation) {
        await RNFS.unlink(targetLocation);
    }
    return true;
}

interface CheckDirectorySizeOptions {
    fileFilter?: (fileName: string, index: number, fileList: string[]) => boolean;
}

async function checkDirectorySize(checkPath: string, options: CheckDirectorySizeOptions = {}) {
    let items = (await RNFS.readdir(checkPath)).map(e => path.join(checkPath, e));
    if (options.fileFilter) {
        items = items.filter(options.fileFilter);
    }
    let totalSize = 0;
    for (let i = 0; i < items.length; i++) {
        const meta = await RNFS.stat(items[i]);
        totalSize += meta.size;
    }
    return totalSize;
}

export async function countSize() {
    const tracks = await TrackPlayer.getQueue();
    const cacheSize = await checkDirectorySize(BILISOUND_OFFLINE_PATH);
    const cacheFreeSize = await checkDirectorySize(BILISOUND_OFFLINE_PATH, {
        fileFilter(fileName) {
            const name = path.parse(fileName).name;
            return !tracks.find(e => `${e.bilisoundId}_${e.bilisoundEpisode}` === name);
        },
    });
    return { cacheSize, cacheFreeSize };
}

export async function cleanAudioCache() {
    const tracks = await TrackPlayer.getQueue();
    const items = (await RNFS.readdir(BILISOUND_OFFLINE_PATH))
        .map(e => path.join(BILISOUND_OFFLINE_PATH, e))
        .filter(fileName => {
            const name = path.parse(fileName).name;
            return !tracks.find(e => `${e.bilisoundId}_${e.bilisoundEpisode}` === name);
        });
    for (let i = 0; i < items.length; i++) {
        await RNFS.unlink(items[i]);
    }
}

export function getCacheAudioPath(id: string, episode: number, isAudio = true) {
    if (isAudio) {
        return `${BILISOUND_OFFLINE_PATH}/${id}_${episode}.m4a`;
    }
    return `${BILISOUND_OFFLINE_PATH}/${id}_${episode}.tmp`;
}
