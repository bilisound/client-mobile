import useDownloadStore from "~/store/download";
import { getCacheAudioPath } from "~/utils/file";
import * as FileSystem from "expo-file-system";
import { filesize } from "filesize";
import { getBilisoundResourceUrl } from "~/api/bilisound";
import log from "~/utils/logger";
import useSettingsStore from "~/store/settings";
import { getVideoUrl } from "~/business/constant-helper";
import { USER_AGENT_BILIBILI } from "~/constants/network";
import { cacheStatusStorage } from "~/storage/cache-status";
import { extractAudioFile } from "~/business/mp4";
import { File } from "expo-file-system/next";
import downloadQueue from "./download-queue";

export async function downloadResource(bvid: string, episode: number, title: string) {
    const prefix = `[${bvid} / ${episode}] `;
    const { updateDownloadItem, updateDownloadItemPartial, removeDownloadItem, downloadList, abortController } =
        useDownloadStore.getState();

    const playingRequest = {
        id: bvid,
        episode,
    };
    const id = `${playingRequest.id}_${playingRequest.episode}`;

    // 避免重复操作
    if (downloadList.has(id)) {
        log.debug(prefix + "已经有相同任务在处理");
        return;
    }
    // 待检查的本地音频路径（包括从视频提取的音频）
    const checkUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode, false);

    if (cacheStatusStorage.getBoolean(playingRequest.id + "_" + playingRequest.episode)) {
        log.debug(prefix + "本地缓存有对应内容记录，不需要下载");
        return;
    }

    log.debug(prefix + "本地缓存无对应内容，开始请求网络资源");
    // 在状态管理器创建下载任务
    const startTime = new Date().getTime();
    updateDownloadItem(id, {
        title,
        id: playingRequest.id,
        episode: playingRequest.episode,
        path: checkUrl,
        startTime,
        progress: {
            totalBytesExpectedToWrite: 0,
            totalBytesWritten: 0,
        },
        progressOld: {
            totalBytesExpectedToWrite: 0,
            totalBytesWritten: 0,
        },
        updateTime: startTime,
        updateTimeOld: startTime,
        status: 0,
    });

    return downloadQueue.add(
        async ({ signal }) => {
            let got = useDownloadStore.getState().downloadList.get(id);
            if (signal?.aborted) {
                log.info("下载任务在开始处理前被取消");
                if (got?.instance) {
                    await got.instance.cancelAsync();
                }
                useDownloadStore.getState().removeDownloadItem(id);
                return;
            }

            // 更新为正在下载的状态
            let updateTime = startTime;
            let updateTimeOld = startTime;
            updateDownloadItem(id, {
                title,
                id: playingRequest.id,
                episode: playingRequest.episode,
                path: checkUrl,
                startTime,
                progress: {
                    totalBytesExpectedToWrite: 0,
                    totalBytesWritten: 0,
                },
                progressOld: {
                    totalBytesExpectedToWrite: 0,
                    totalBytesWritten: 0,
                },
                updateTime,
                updateTimeOld,
                status: 1,
            });

            // 获取源地址
            const { url, isAudio } = await getBilisoundResourceUrl(
                playingRequest.id,
                playingRequest.episode,
                useSettingsStore.getState().filterResourceURL,
            );

            got = useDownloadStore.getState().downloadList.get(id);
            if (signal?.aborted) {
                log.info("下载任务在获取资源链接后、开始前被取消");
                if (got?.instance) {
                    await got.instance.cancelAsync();
                }
                useDownloadStore.getState().removeDownloadItem(id);
                return;
            }

            // 待下载资源地址（可能是音频或视频）
            const downloadTargetFileUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode, true);

            // 下载处理
            const beginTime = global.performance.now();
            const downloadResumable = FileSystem.createDownloadResumable(
                url,
                downloadTargetFileUrl,
                {
                    headers: {
                        referer: getVideoUrl(playingRequest.id, playingRequest.episode),
                        "user-agent": USER_AGENT_BILIBILI,
                    },
                    cache: true,
                },
                cb => {
                    // console.log(JSON.stringify(downloadResumable, null, 4));
                    // 更新状态管理器中的内容
                    const old = useDownloadStore.getState().downloadList.get(id)!;
                    updateDownloadItemPartial(id, {
                        progress: cb,
                        progressOld: old.progress,
                        updateTime: new Date().getTime(),
                        updateTimeOld: old.updateTime,
                    });
                },
            );
            await downloadResumable.downloadAsync();
            const endTime = global.performance.now();
            const info = await FileSystem.getInfoAsync(downloadTargetFileUrl);
            const fileSize = info?.exists ? info.size : 0;
            const runTime = (endTime - beginTime) / 1000;
            log.debug(
                prefix + `下载任务结束，用时: ${runTime.toFixed(3)}s, 平均下载速度: ${filesize(fileSize / runTime)}/s`,
            );
            updateDownloadItemPartial(id, {
                status: 2,
            });

            if (isAudio) {
                await FileSystem.moveAsync({
                    from: getCacheAudioPath(playingRequest.id, playingRequest.episode, true),
                    to: checkUrl,
                });
                cacheStatusStorage.set(playingRequest.id + "_" + playingRequest.episode, true);
                removeDownloadItem(id);
                return;
            }

            // 如果不是音频流，进行音视频分离操作
            log.info(prefix + "非音频流，进行音视频分离操作");

            // 提取 m4a
            try {
                extractAudioFile(new File(downloadTargetFileUrl), new File(checkUrl));
            } catch (e) {
                log.error(prefix + "视频转码失败！");
                log.error(`result：${e}`);
                throw new Error("视频处理失败");
            }

            // 收尾
            log.debug(prefix + "删除不再需要的视频文件");
            await FileSystem.deleteAsync(downloadTargetFileUrl);
            cacheStatusStorage.set(playingRequest.id + "_" + playingRequest.episode, true);
            removeDownloadItem(id);
        },
        // { signal: abortController.signal }, // 坏的，因为 React Native 没有 throwIfAborted
    );
}
