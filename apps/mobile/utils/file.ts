import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import path from "path-browserify";

import { BILISOUND_OFFLINE_URI, BILISOUND_PROCESS_URI } from "~/constants/file";
import { cacheStatusStorage } from "~/storage/cache-status";
import log from "~/utils/logger";

export async function saveTextFile(name: string, content: string, mimeType = "text/plain") {
    /*if (Platform.OS === "android") {
        log.debug("使用 Android SAF 保存文本文件");
        const response = await createDocument(content, {
            initialName: name,
            encoding: "utf8",
        });
        log.debug("保存文件流程结束");
        return !!response;
    }*/
    const filePath = FileSystem.cacheDirectory + `/shared_text_file_${new Date().getTime()}`;
    const fileFullPath = `${filePath}/${name}`;
    await FileSystem.makeDirectoryAsync(filePath, {
        intermediates: true,
    });
    await FileSystem.writeAsStringAsync(fileFullPath, content);
    log.debug("分享文件：" + fileFullPath);
    await Sharing.shareAsync(fileFullPath, {
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
    /*const parsed = path.parse(location);
    const fileName = replaceFileName ?? `${parsed.name}${parsed.ext}`;

    if (Platform.OS === "android") {
        const response = await createDocument(await FileSystem.readAsStringAsync(location, { encoding: "base64" }), {
            initialName: fileName,
            encoding: "base64",
        });
        if (response) {
            Toast.show({
                type: "success",
                text1: "音频文件已保存",
            });
        }
        return !!response;
    }*/
    let targetLocation = "";

    if (replaceFileName) {
        const targetDir = `${FileSystem.cacheDirectory}/sharing-${new Date().getTime()}`;
        targetLocation = `${targetDir}/${replaceFileName}`;
        await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });
        await FileSystem.copyAsync({
            from: location,
            to: targetLocation,
        });
    }
    await Sharing.shareAsync(targetLocation || location, {
        mimeType: "application/octet-stream",
    });
    if (targetLocation) {
        await FileSystem.deleteAsync(targetLocation);
    }
    return true;
}

interface CheckDirectorySizeOptions {
    fileFilter?: (fileName: string, index: number, fileList: string[]) => boolean;
}

async function checkDirectorySizeByUri(uri: string, options: CheckDirectorySizeOptions = {}) {
    let items = (await FileSystem.readDirectoryAsync(uri)).map(e => {
        return uri + "/" + encodeURI(e);
    });
    if (options.fileFilter) {
        items = items.filter(options.fileFilter);
    }
    let totalSize = 0;
    for (let i = 0; i < items.length; i++) {
        const meta = await FileSystem.getInfoAsync(items[i]);
        if (meta.exists) {
            totalSize += meta.size;
        }
    }
    return totalSize;
}

export async function cleanAudioCache() {
    const tracks: any[] = []; // await TrackPlayer.getQueue();
    const items = (await FileSystem.readDirectoryAsync(BILISOUND_OFFLINE_URI))
        .map(e => {
            return BILISOUND_OFFLINE_URI + "/" + encodeURI(e);
        })
        .filter(fileName => {
            const name = path.parse(uriToPath(fileName)).name;
            return !tracks.find(e => `${e.bilisoundId}_${e.bilisoundEpisode}` === name);
        });
    for (let i = 0; i < items.length; i++) {
        const name = path.parse(uriToPath(items[i])).name;
        await FileSystem.deleteAsync(items[i]);
        cacheStatusStorage.delete(name);
    }
}

export function getCacheAudioPath(id: string, episode: number, isTemp = false) {
    if (isTemp) {
        return `${BILISOUND_PROCESS_URI}/${id}_${episode}.tmp`;
    }
    return `${BILISOUND_OFFLINE_URI}/${id}_${episode}.m4a`;
}

export function uriToPath(uri: string) {
    return decodeURI(uri.slice(7));
}

export function pathToUri(path: string) {
    return `file://${encodeURI(path)}`;
}
