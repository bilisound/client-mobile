import { Toast, ToastDescription, ToastTitle, useToast, VStack } from "@gluestack-ui/themed";
import React from "react";
import { Platform } from "react-native";
import TrackPlayer, { Track } from "react-native-track-player";
import { getActiveTrack } from "react-native-track-player/lib/src/trackPlayer";
import { v4 as uuidv4 } from "uuid";

import log from "./logger";
import { convertToHTTPS } from "./string";
import { saveTrackData } from "./track-data";

import useToastContainerStyle from "~/hooks/useToastContainerStyle";
import { invalidateOnQueueStatus } from "~/storage/playlist";
import { getOnlineUrl } from "~/utils/constant-helper";

export interface PlayingInformation {
    id: string;
    episode: number;
    title: string;
    artist: string;
    artwork: string;
    duration: number;
}

export async function handleReDownload(param: { activeTrack?: Track; activeTrackIndex?: number } = {}) {
    const { activeTrack } = param;
    if (activeTrack && !activeTrack.bilisoundIsLoaded) {
        await TrackPlayer.play();
    }
}

export async function addTrackToQueue(
    playingRequest: PlayingInformation,
    {
        toast,
        containerStyle,
    }: {
        toast: ReturnType<typeof useToast>;
        containerStyle: ReturnType<typeof useToastContainerStyle>;
    },
) {
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

        log.debug("正在添加到歌单");

        // 清除当前播放队列隶属的歌单
        invalidateOnQueueStatus();
        let addResult = await TrackPlayer.add([
            {
                url: getOnlineUrl(playingRequest.id, playingRequest.episode),
                title: playingRequest.title,
                artist: playingRequest.artist,
                artwork: convertToHTTPS(playingRequest.artwork),
                duration: playingRequest.duration,
                bilisoundId: playingRequest.id,
                bilisoundEpisode: playingRequest.episode,
                bilisoundUniqueId: uuidv4(),
                bilisoundIsLoaded: true,
            },
        ]);
        if (Platform.OS === "web") {
            // todo 解决插入曲目的位置在当前播放的曲目前面的问题
            addResult = Math.max((await TrackPlayer.getQueue()).length - 2, 0);
            log.debug(`正在尝试播放刚添加的音频。addResult (web): ${addResult}`);
            await TrackPlayer.skip(addResult);
        } else {
            log.debug(`正在尝试播放刚添加的音频。addResult: ${addResult}`);
            await TrackPlayer.skip(addResult || 0);
        }
        await TrackPlayer.play();

        log.debug("正在保存歌单");
        try {
            await saveTrackData();
        } catch (e) {
            log.error(`歌单保存失败。错误信息：${e}`);
        }
    } catch (e) {
        // 操作失败
        toast.show({
            placement: "top",
            containerStyle,
            render: ({ id }) => (
                <Toast nativeID={`toast-${id}`} action="error" variant="accent">
                    <VStack space="xs">
                        <ToastTitle>操作失败</ToastTitle>
                        <ToastDescription>目前无法完成当前播放请求，请稍后再试</ToastDescription>
                    </VStack>
                </Toast>
            ),
        });
        log.error(`执行播放操作时发生错误。错误信息：${e}`);
        throw e;
    }
}
