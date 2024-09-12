/**
 * 保存文件到「本地」。iOS 下，分享文件给文件 App；Android 下，通过 StorageAccessFramework 保存到用户路径
 * @param location
 * @param replaceFileName
 */
export async function saveFile(location: string, replaceFileName?: string) {
    console.warn("saveFile 未实现");
}

export async function countSize() {
    return 0;
}

export async function cleanAudioCache() {
    console.warn("cleanAudioCache 未实现");
}

export function getCacheAudioPath(id: string, episode: number, isAudio = true) {
    return "";
}
