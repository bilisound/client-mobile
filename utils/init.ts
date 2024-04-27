import { SplashScreen } from "expo-router";
import RNFS from "react-native-fs";
import TrackPlayer, { Capability } from "react-native-track-player";

import log from "./logger";
import { initPlaybackService } from "./player-control";
import { loadTrackData } from "./track-data";
import { BILISOUND_LOG_PATH, BILISOUND_OFFLINE_PATH } from "../constants/file";
import useSettingsStore from "../store/settings";

export default async function init() {
    // 日志系统初始化
    await useSettingsStore.persist.rehydrate();
    const settings = useSettingsStore.getState();
    log.setSeverity(settings.debugMode ? "debug" : "info");

    // 目录初始化
    try {
        await RNFS.mkdir(BILISOUND_LOG_PATH);
        await RNFS.mkdir(BILISOUND_OFFLINE_PATH);
        log.debug("目录初始化成功");
    } catch (e) {
        log.error(`目录初始化失败。原因：${e}`);
    }

    // 播放服务初始化
    try {
        initPlaybackService();
        log.debug("播放服务初始化成功");
    } catch (e) {
        log.error(`播放服务注册失败。原因：${e}`);
    }
    log.debug("初始化完毕！");

    // 播放器初始化
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            // Media controls capabilities
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                // Capability.Stop,
                Capability.SeekTo,
            ],

            // Capabilities that will show up when the notification is in the compact form on Android
            compactCapabilities: [Capability.Play, Capability.Pause],
        });

        // 还原歌单
        try {
            await loadTrackData();
        } catch (e) {
            log.error(`歌单初始化失败。原因：${e}`);
        }
    } catch (e) {
        log.warn(`播放器初始化失败（通常是播放器已经初始化过了）。错误信息：${e}`);
    }

    // 隐藏 Splash Screen
    await SplashScreen.hideAsync();

    return "done";
}
