import React, { useEffect } from "react";
import TrackPlayer, { Event, State, useTrackPlayerEvents } from "react-native-track-player";
import { v4 as uuidv4 } from "uuid";
import RNFS from "react-native-fs";
import { EmitterSubscription } from "react-native";
import { filesize } from "filesize";
import { Toast, ToastDescription, ToastTitle, useToast, VStack } from "@gluestack-ui/themed";
import usePlayerStateStore from "../store/playerState";
import { USER_AGENT_BILIBILI } from "../constants/network";
import { getBilisoundResourceUrl, getVideoUrl } from "../api/bilisound";
import { getCacheAudioPath, requestWrapper } from "../utils/misc";
import useDownloadStore from "../store/download";
import useSettingsStore from "../store/settings";
import { convertToHTTPS } from "../utils/string";
import { saveTrackData } from "../utils/track-data";
import log from "../utils/logger";

const events = [Event.PlaybackState, Event.PlaybackError];

const AudioManager: React.FC = () => {
    const toast = useToast();

    const { playingRequest, setPlayingRequest } = usePlayerStateStore((state) => ({
        playingRequest: state.playingRequest,
        setPlayingRequest: state.setPlayingRequest,
    }));

    const { updateDownloadItem, removeDownloadItem } = useDownloadStore((state) => ({
        updateDownloadItem: state.updateDownloadItem,
        removeDownloadItem: state.removeDownloadItem,
    }));

    const { filterResourceURL } = useSettingsStore((state) => ({
        filterResourceURL: state.filterResourceURL,
    }));

    useTrackPlayerEvents(events, (event) => {
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
        if (event.type === Event.PlaybackState) {
            /* if (event.state === State.Buffering || event.state === State.Ready) {
                TrackPlayer.play();
            } */
            if (event.state === State.Playing) {
                // 重置状态机
                setPlayingRequest(null);
            }
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
                (e) => e.bilisoundId === playingRequest.id && e.bilisoundEpisode === playingRequest.episode,
            );
            if (found >= 0) {
                log.debug("播放列表中已有相同内容，直接跳转");
                await TrackPlayer.skip(found);
                return;
            }

            // 播放列表中还没有，执行常规查询操作
            log.debug("播放列表中无相同内容，执行常规查询操作");
            await TrackPlayer.pause();
            const url = await getBilisoundResourceUrl({
                id: playingRequest.id,
                episode: playingRequest.episode,
                filterResourceURL,
            });

            const checkUrl = getCacheAudioPath(playingRequest.id, playingRequest.episode);

            if (await RNFS.exists(checkUrl)) {
                log.debug("本地缓存有对应内容，直接使用");
            } else {
                log.debug("本地缓存无对应内容，开始请求网络资源");
                const id = `${playingRequest.id}_${playingRequest.episode}`;

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

                const beginTime = global.performance.now();
                const downloadTask = RNFS.downloadFile({
                    fromUrl: url,
                    toFile: checkUrl,
                    headers: {
                        referer: getVideoUrl(playingRequest.id, playingRequest.episode),
                        "user-agent": USER_AGENT_BILIBILI,
                    },
                    cacheable: true,
                    progressInterval: 1000, // 过快的下载进度更新会导致 UI 跟不上
                    progress: (res) => {
                        // console.log(res);
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

            const addResult = await TrackPlayer.add([
                {
                    url: `file://${encodeURI(checkUrl)}`,
                    title: playingRequest.title,
                    artist: playingRequest.artist,
                    artwork: convertToHTTPS(playingRequest.artwork),
                    duration: playingRequest.duration,
                    bilisoundId: playingRequest.id,
                    bilisoundEpisode: playingRequest.episode,
                    bilisoundUniqueId: uuidv4(),
                },
            ]);
            // await TrackPlayer.play();

            log.debug("正在等待播放服务准备就绪");
            eventHandler = TrackPlayer.addEventListener(Event.PlaybackState, async (e) => {
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
            .catch((e) => {
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
    }, [playingRequest]);

    return null;
};

export default AudioManager;
