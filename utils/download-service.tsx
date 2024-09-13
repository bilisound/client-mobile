import * as FileSystem from "expo-file-system";
import { FFmpegKit, FFprobeKit } from "ffmpeg-kit-react-native";
import { filesize } from "filesize";
import Toast from "react-native-toast-message";
import TrackPlayer, { Track } from "react-native-track-player";
import { getActiveTrack } from "react-native-track-player/lib/src/trackPlayer";
import { v4 as uuidv4 } from "uuid";

import { getCacheAudioPath } from "./file";
import log from "./logger";
import { convertToHTTPS } from "./string";
import { saveTrackData } from "./track-data";

import { getBilisoundResourceUrl, getVideoUrl } from "~/api/bilisound";
import { USER_AGENT_BILIBILI } from "~/constants/network";
import { invalidateOnQueueStatus } from "~/storage/playlist";
import { addToQueueListBackup, getQueuePlayingMode } from "~/storage/queue";
import useDownloadStore from "~/store/download";
import useSettingsStore from "~/store/settings";

export interface PlayingInformation {
    id: string;
    episode: number;
    title: string;
    artist: string;
    artwork: string;
    duration: number;
}

const reDownloadLock = new Set<string>();

export async function handleReDownload(param: { activeTrack?: Track; activeTrackIndex?: number } = {}) {
    const { updateDownloadItem, removeDownloadItem, downloadList } = useDownloadStore.getState();
    const { filterResourceURL } = useSettingsStore.getState();
    const { activeTrackIndex, activeTrack } = param;

    // 上锁处理
    if (activeTrack) {
        const id = `${activeTrack.bilisoundId}_${activeTrack.bilisoundEpisode}`;
        if (reDownloadLock.has(id)) {
            return;
        }
        reDownloadLock.add(id);
    }

    log.debug(`开始处理下载请求。param: ${JSON.stringify(param)}`);
    if (activeTrack && !activeTrack.bilisoundIsLoaded) {
        log.debug("没有 isLoaded，开始进行处理");
        const playingRequest = {
            id: activeTrack.bilisoundId,
            episode: activeTrack.bilisoundEpisode,
        };
        const id = `${playingRequest.id}_${playingRequest.episode}`;

        // 避免重复操作
        if (downloadList.has(id)) {
            log.debug("已经有相同任务在处理");
            return;
        }
        // 待检查的本地音频路径（包括从视频提取的音频）
        const checkUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode);

        if ((await FileSystem.getInfoAsync(checkUrl)).exists) {
            log.debug("本地缓存有对应内容，直接使用");
        } else {
            log.debug("本地缓存无对应内容，开始请求网络资源");

            // 在状态管理器创建下载任务
            updateDownloadItem(id, {
                id: playingRequest.id,
                episode: playingRequest.episode,
                path: checkUrl,
                progress: {
                    totalBytesExpectedToWrite: 0,
                    totalBytesWritten: 0,
                },
            });

            // 获取源地址
            const { url, isAudio } = await getBilisoundResourceUrl({
                id: playingRequest.id,
                episode: playingRequest.episode,
                filterResourceURL,
            });

            // 待下载资源地址（可能是音频或视频）
            const downloadTargetFileUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode, isAudio);

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
                    // 更新状态管理器中的内容
                    updateDownloadItem(id, {
                        id: playingRequest.id,
                        episode: playingRequest.episode,
                        path: downloadTargetFileUrl,
                        progress: cb,
                    });
                },
            );
            await downloadResumable.downloadAsync();
            const endTime = global.performance.now();
            const info = await FileSystem.getInfoAsync(downloadTargetFileUrl);
            const fileSize = info?.exists ? info.size : 0;
            const runTime = (endTime - beginTime) / 1000;
            log.debug(`下载任务结束，用时: ${runTime.toFixed(3)}s, 平均下载速度: ${filesize(fileSize / runTime)}/s`);
            removeDownloadItem(id);

            if (!isAudio) {
                // 如果不是音频流，进行音视频分离操作
                log.info("非音频流，进行音视频分离操作");

                // 格式判断
                const probeSession = await FFprobeKit.execute(
                    `-v error -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 ${JSON.stringify(downloadTargetFileUrl)}`,
                );
                let returnCode = await probeSession.getReturnCode();
                let result = await probeSession.getOutput();
                if (!returnCode.isValueSuccess()) {
                    log.error("视频编码识别失败！");
                    log.error(`returnCode: ${returnCode}`);
                    log.error(`result：${result}`);
                    throw new Error("视频处理失败");
                }

                // 进行转码或直接提取操作
                let mpegSession;
                if (result.trim() === "aac") {
                    log.debug("进行提取音频流操作");
                    mpegSession = await FFmpegKit.execute(
                        `-i ${JSON.stringify(downloadTargetFileUrl)} -vn -acodec copy ${JSON.stringify(checkUrl)}`,
                    );
                } else {
                    log.debug(`进行转码音频流操作。原因：音频编码是 ${result}`);
                    mpegSession = await FFmpegKit.execute(
                        // 别的编码（比如 mp3）通常音质不会特别好，所以先设置 256kbps 的动态码率了
                        // （叔叔会有上 opus 的一天吗？）
                        `-i ${JSON.stringify(downloadTargetFileUrl)} -vn -acodec aac -b:a 256k ${JSON.stringify(checkUrl)}`,
                    );
                }
                returnCode = await mpegSession.getReturnCode();
                result = await mpegSession.getOutput();
                if (!returnCode.isValueSuccess()) {
                    log.error("视频转码失败！");
                    log.error(`returnCode: ${returnCode}`);
                    log.error(`result：${result}`);
                    throw new Error("视频处理失败");
                }

                // 收尾
                log.debug("删除不再需要的视频文件");
                await FileSystem.deleteAsync(downloadTargetFileUrl);
            }
        }

        // 如果现在「播放」的曲目还是正在加载的曲目
        if ((await getActiveTrack())?.bilisoundUniqueId === activeTrack.bilisoundUniqueId) {
            log.debug("现在「播放」的曲目还是正在加载的曲目，因此替换当前的曲目");
            await TrackPlayer.load({ ...activeTrack, url: checkUrl, bilisoundIsLoaded: true });
            await TrackPlayer.play();
            await saveTrackData();
        } else if (typeof activeTrackIndex === "number") {
            log.debug("现在「播放」的曲目是即将播放的曲目，替换处理");
            await TrackPlayer.remove([activeTrackIndex]);
            await TrackPlayer.add({ ...activeTrack, url: checkUrl, bilisoundIsLoaded: true }, activeTrackIndex);
            await saveTrackData();
        } else {
            log.debug("现在「播放」的曲目不是正在加载的曲目，放置处理");
        }
        reDownloadLock.delete(id);
    }
}

export async function addTrackToQueue(playingRequest: PlayingInformation) {
    try {
        log.info("收到用户播放请求");
        log.debug(`playingRequest 对象内容：${JSON.stringify(playingRequest)}`);

        // 歌单中有，直接跳转
        const list = await TrackPlayer.getQueue();
        const found = list.findIndex(
            e => e.bilisoundId === playingRequest.id && e.bilisoundEpisode === playingRequest.episode,
        );
        if (found >= 0) {
            log.debug("歌单中已有相同内容，直接跳转");
            await TrackPlayer.skip(found);
            return;
        }

        // 歌单中还没有，执行常规查询操作
        log.debug("歌单中无相同内容，执行常规查询操作");
        await TrackPlayer.pause();

        let url = "";
        let isLoaded = false;
        const checkUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode);

        if ((await FileSystem.getInfoAsync(checkUrl)).exists) {
            log.debug("本地缓存有对应内容，直接使用");
            url = `file://${encodeURI(checkUrl)}`;
            isLoaded = true;
        } else {
            log.debug("本地缓存无对应内容，添加占位资源");
            url = require("~/assets/placeholder.mp3");
        }

        log.debug("正在添加到歌单");

        // 清除当前播放队列隶属的歌单
        invalidateOnQueueStatus();
        const addData = {
            url,
            title: playingRequest.title,
            artist: playingRequest.artist,
            artwork: convertToHTTPS(playingRequest.artwork),
            duration: playingRequest.duration,
            bilisoundId: playingRequest.id,
            bilisoundEpisode: playingRequest.episode,
            bilisoundUniqueId: uuidv4(),
            bilisoundIsLoaded: isLoaded,
        };
        const addResult = await TrackPlayer.add(addData);
        log.debug("正在尝试播放刚添加的音频");
        await TrackPlayer.skip(addResult || 0);
        await TrackPlayer.play();

        // 随机状态下还要加到备份队列中
        if (getQueuePlayingMode() === "shuffle") {
            addToQueueListBackup([addData]);
        }

        log.debug("正在保存歌单");
        try {
            await saveTrackData();
        } catch (e) {
            log.error(`歌单保存失败。错误信息：${e}`);
        }
    } catch (e) {
        // 操作失败
        Toast.show({
            type: "error",
            text1: "操作失败",
            text2: "目前无法完成当前播放请求，请稍后再试",
        });
        log.error(`执行播放操作时发生错误。错误信息：${e}`);
        throw e;
    }
}
