import { BILISOUND_OFFLINE_PATH } from "~/constants/file";

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

/**
 * 保存文件到「本地」。iOS 下，分享文件给文件 App；Android 下，通过 StorageAccessFramework 保存到用户路径
 * @param location
 * @param replaceFileName
 */
export async function saveFile(location: string, replaceFileName?: string) {
    console.warn("saveFile 未实现");
}

export interface CheckDirectorySizeOptions {
    fileFilter?: (fileName: string, index: number, fileList: string[]) => boolean;
}

export async function checkDirectorySize(checkPath: string, options: CheckDirectorySizeOptions = {}) {
    return 0;
}

export async function cleanAudioCache() {
    console.warn("cleanAudioCache 未实现");
}

export function getCacheAudioPath(id: string, episode: number, isAudio = true) {
    if (isAudio) {
        return `${BILISOUND_OFFLINE_PATH}/${id}_${episode}.m4a`;
    }
    return `${BILISOUND_OFFLINE_PATH}/${id}_${episode}.tmp`;
}
