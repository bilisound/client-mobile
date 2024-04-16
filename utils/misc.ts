import * as Sharing from "expo-sharing";
import path from "path-browserify";
import { Platform, PressableProps, ToastAndroid } from "react-native";
import RNFS from "react-native-fs";
import { createDocument } from "react-native-saf-x";
import TrackPlayer from "react-native-track-player";

import log from "./logger";
import { handleTogglePlay } from "./player-control";
import { BILISOUND_OFFLINE_PATH } from "../constants/file";

export function formatDate(date: number | string | Date, fmt = "yyyy-MM-dd hh:mm:ss") {
    date = new Date(date);
    const o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };

    const testResultYear = /(y+)/.exec(fmt);
    if (testResultYear)
        fmt = fmt.replace(testResultYear[1], `${date.getFullYear()}`.slice(4 - testResultYear[1].length));
    (Object.keys(o) as (keyof typeof o)[]).forEach(k => {
        const testResult = new RegExp(`(${k})`).exec(fmt);
        if (testResult) {
            fmt = fmt.replace(
                testResult[1],
                testResult[1].length === 1 ? `${o[k]}` : `00${o[k]}`.slice(`${o[k]}`.length),
            );
        }
    });
    return fmt;
}

export function formatSecond(secNum: number) {
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - hours * 3600) / 60);
    const seconds = Math.floor(secNum - hours * 3600 - minutes * 60);

    if (secNum >= 3600) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0",
        )}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export interface RequestWrapperOptions {
    beforeThrow?: (error: any) => void;
}

export async function requestWrapper(func: () => Promise<void>, options: RequestWrapperOptions = {}) {
    try {
        await func();
    } catch (e) {
        if (options.beforeThrow) {
            options.beforeThrow(e);
        }
        throw e;
    }
}

/**
 * @deprecated
 */
export function togglePlay() {
    return handleTogglePlay();
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
            ToastAndroid.show("音频文件保存成功了！", ToastAndroid.SHORT);
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

export interface CheckDirectorySizeOptions {
    fileFilter?: (fileName: string, index: number, fileList: string[]) => boolean;
}

export async function checkDirectorySize(checkPath: string, options: CheckDirectorySizeOptions = {}) {
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

export function commonPressableColor(hoverColor: string) {
    return {
        style: ({ pressed }) => ({
            backgroundColor: pressed && Platform.OS !== "android" ? hoverColor : "transparent",
        }),
        android_ripple: {
            color: hoverColor,
        },
    } as Partial<PressableProps>;
}

export function getCacheAudioPath(id: string, episode: number) {
    return `${BILISOUND_OFFLINE_PATH}/${id}_${episode}.m4a`;
}
