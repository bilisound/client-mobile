import { SplashScreen } from "expo-router";
import TrackPlayer, { Capability } from "react-native-track-player";

import log from "./logger";
import { initPlaybackService } from "./player-control";
import { loadTrackData } from "./track-data";
import useSettingsStore from "../store/settings";

export default async function init() {
    // 日志系统初始化
    await useSettingsStore.persist.rehydrate();
    const settings = useSettingsStore.getState();
    log.setSeverity(settings.debugMode ? "debug" : "info");

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
            const { tracks, current } = await loadTrackData();
            await TrackPlayer.setQueue(tracks);
            if (current) {
                await TrackPlayer.skip(current);
            }
            await TrackPlayer.stop();
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
