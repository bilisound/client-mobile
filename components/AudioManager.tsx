import { Toast, ToastDescription, ToastTitle, useToast, VStack } from "@gluestack-ui/themed";
import { filesize } from "filesize";
import React, { useEffect } from "react";
import { EmitterSubscription } from "react-native";
import RNFS from "react-native-fs";
import TrackPlayer, { Event, State, useTrackPlayerEvents } from "react-native-track-player";
import { getActiveTrack } from "react-native-track-player/src/trackPlayer";
import { v4 as uuidv4 } from "uuid";

import { getBilisoundResourceUrl, getVideoUrl } from "../api/bilisound";
import { USER_AGENT_BILIBILI } from "../constants/network";
import useDownloadStore from "../store/download";
import usePlayerStateStore from "../store/playerState";
import useSettingsStore from "../store/settings";
import log from "../utils/logger";
import { getCacheAudioPath } from "../utils/misc";
import { convertToHTTPS } from "../utils/string";
import { saveTrackData } from "../utils/track-data";

const events = [Event.PlaybackState, Event.PlaybackError, Event.PlaybackActiveTrackChanged];

const reDownloadLock = new Set<string>();

async function handleReDownload() {
    const { updateDownloadItem, removeDownloadItem, downloadList } = useDownloadStore.getState();
    const { filterResourceURL } = useSettingsStore.getState();
    const { setPlayingRequest } = usePlayerStateStore.getState();

    const activeTrack = await getActiveTrack();
    console.log(activeTrack);

    // 上锁处理
    if (activeTrack) {
        const id = `${activeTrack.bilisoundId}_${activeTrack.bilisoundEpisode}`;
        if (reDownloadLock.has(id)) {
            return;
        }
        reDownloadLock.add(id);
    }

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
        const checkUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode);

        if (await RNFS.exists(checkUrl)) {
            log.debug("本地缓存有对应内容，直接使用");
        } else {
            log.debug("本地缓存无对应内容，开始请求网络资源");

            // 在状态管理器创建下载任务
            updateDownloadItem(id, {
                id: playingRequest.id,
                episode: playingRequest.episode,
                path: checkUrl,
                progress: {
                    jobId: -1,
                    contentLength: 0,
                    bytesWritten: 0,
                },
            });

            // 获取源地址
            const url = await getBilisoundResourceUrl({
                id: playingRequest.id,
                episode: playingRequest.episode,
                filterResourceURL,
            });

            const beginTime = global.performance.now();
            const downloadTask = RNFS.downloadFile({
                fromUrl: url,
                toFile: checkUrl,
                headers: {
                    referer: getVideoUrl(playingRequest.id, playingRequest.episode),
                    "user-agent": USER_AGENT_BILIBILI,
                },
                cacheable: true,
                progressInterval: 100, // 过快的下载进度更新会导致 UI 跟不上
                progress: res => {
                    // 更新状态管理器中的内容
                    updateDownloadItem(id, {
                        id: playingRequest.id,
                        episode: playingRequest.episode,
                        path: checkUrl,
                        progress: res,
                    });
                },
            });
            log.debug(`下载任务 ${downloadTask.jobId} 开始`);

            await downloadTask.promise;
            const endTime = global.performance.now();
            const fileSize = (await RNFS.stat(checkUrl)).size;
            const runTime = (endTime - beginTime) / 1000;
            log.debug(
                `下载任务 ${downloadTask.jobId} 结束，用时: ${runTime.toFixed(3)}s, 平均下载速度: ${filesize(
                    fileSize / runTime,
                )}/s`,
            );
            removeDownloadItem(id);
        }

        // 如果现在「播放」的曲目还是正在加载的曲目
        if ((await getActiveTrack())?.bilisoundUniqueId === activeTrack.bilisoundUniqueId) {
            log.debug("现在「播放」的曲目还是正在加载的曲目，因此替换当前的曲目");
            await TrackPlayer.load({ ...activeTrack, url: checkUrl, bilisoundIsLoaded: true });
        } else {
            log.debug("现在「播放」的曲目不是正在加载的曲目，放置处理");
        }
        await TrackPlayer.play();
        setPlayingRequest(null);
        reDownloadLock.delete(id);
    }
}

const AudioManager: React.FC = () => {
    const toast = useToast();

    const { playingRequest, setPlayingRequest } = usePlayerStateStore(state => ({
        playingRequest: state.playingRequest,
        setPlayingRequest: state.setPlayingRequest,
    }));

    useTrackPlayerEvents(events, async event => {
        if (event.type === Event.PlaybackError) {
            toast.show({
                placement: "top",
                render: ({ id }) => (
                    <Toast nativeID={`toast-${id}`} action="error" variant="accent">
                        <VStack space="xs">
                            <ToastTitle>操作失败</ToastTitle>
                            <ToastDescription>目前无法播放这个曲目</ToastDescription>
                        </VStack>
                    </Toast>
                ),
            });
            setPlayingRequest(null);
            log.error(`无法播放所请求的曲目。原因：${JSON.stringify(event)}`);
        }
        /*if (event.type === Event.PlaybackState) {
            if (event.state === State.Playing) {
                // 重置状态机
                setPlayingRequest(null);
            }
        }*/
        if (event.type === Event.PlaybackActiveTrackChanged) {
            handleReDownload();
        }
    });

    useEffect(() => {
        if (playingRequest === null) {
            return () => {};
        }

        let eventHandler: EmitterSubscription | undefined;
        (async () => {
            log.info("收到用户播放请求");
            log.debug(`playingRequest 对象内容：${JSON.stringify(playingRequest)}`);

            // 播放列表中有，直接跳转
            const list = await TrackPlayer.getQueue();
            const found = list.findIndex(
                e => e.bilisoundId === playingRequest.id && e.bilisoundEpisode === playingRequest.episode,
            );
            if (found >= 0) {
                log.debug("播放列表中已有相同内容，直接跳转");
                await TrackPlayer.skip(found);
                setPlayingRequest(null);
                return;
            }

            // 播放列表中还没有，执行常规查询操作
            log.debug("播放列表中无相同内容，执行常规查询操作");
            await TrackPlayer.pause();

            let url = "";
            let isLoaded = false;
            const checkUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode);

            if (await RNFS.exists(checkUrl)) {
                log.debug("本地缓存有对应内容，直接使用");
                url = `file://${encodeURI(checkUrl)}`;
                isLoaded = true;
            } else {
                log.debug("本地缓存无对应内容，添加占位资源");
                url = require("../assets/placeholder.mp3");
            }

            const addResult = await TrackPlayer.add([
                {
                    url,
                    title: playingRequest.title,
                    artist: playingRequest.artist,
                    artwork: convertToHTTPS(playingRequest.artwork),
                    duration: playingRequest.duration,
                    bilisoundId: playingRequest.id,
                    bilisoundEpisode: playingRequest.episode,
                    bilisoundUniqueId: uuidv4(),
                    bilisoundIsLoaded: isLoaded,
                },
            ]);
            await TrackPlayer.play();

            log.debug("正在等待播放服务准备就绪");
            eventHandler = TrackPlayer.addEventListener(Event.PlaybackState, async e => {
                if (e.state === State.Ready) {
                    log.debug("播放服务准备就绪，开始播放");
                    await TrackPlayer.play();
                    eventHandler?.remove();
                }
            });

            try {
                await saveTrackData();
            } catch (e) {
                log.error(`播放列表保存失败。错误信息：${e}`);
            }

            await TrackPlayer.skip(addResult || 0);
        })()
            .then(() => {
                // 操作成功
            })
            .catch(e => {
                // 操作失败
                toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <Toast nativeID={`toast-${id}`} action="error" variant="accent">
                            <VStack space="xs">
                                <ToastTitle>操作失败</ToastTitle>
                                <ToastDescription>目前无法完成当前播放请求，请稍后再试</ToastDescription>
                            </VStack>
                        </Toast>
                    ),
                });
                setPlayingRequest(null);
                log.error(`执行播放操作时发生错误。错误信息：${e}`);
            });

        return () => {
            eventHandler?.remove();
        };
    }, [playingRequest, setPlayingRequest, toast]);

    return null;
};

export default AudioManager;
