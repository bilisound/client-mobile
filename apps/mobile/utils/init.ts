import * as FileSystem from "expo-file-system";
import { SplashScreen } from "expo-router";

import log from "./logger";
import useSettingsStore from "../store/settings";

import { BILISOUND_LOG_URI, BILISOUND_OFFLINE_URI } from "~/constants/file";
import { handleCacheStatus } from "~/utils/migration/cache-status";
import { handlePlaylist } from "~/utils/migration/playlist";
import { loadTrackData } from "~/business/playlist/handler";

export default async function init() {
    // 日志系统初始化
    await useSettingsStore.persist.rehydrate();
    const settings = useSettingsStore.getState();
    log.setSeverity(settings.debugMode ? "debug" : "info");

    // 目录初始化
    try {
        if (!(await FileSystem.getInfoAsync(BILISOUND_LOG_URI)).exists) {
            await FileSystem.makeDirectoryAsync(BILISOUND_LOG_URI);
        }
        if (!(await FileSystem.getInfoAsync(BILISOUND_OFFLINE_URI)).exists) {
            await FileSystem.makeDirectoryAsync(BILISOUND_OFFLINE_URI);
        }
        log.debug("目录初始化成功");
    } catch (e) {
        log.error(`目录初始化失败。原因：${e}`);
    }

    // 歌单数据库初始化
    try {
        await handlePlaylist();
        log.debug("数据库初始化成功");
    } catch (e) {
        log.error(`数据库初始化失败。原因：${e}`);
    }

    // 缓存初始化
    try {
        await handleCacheStatus();
        log.debug("缓存初始化成功");
    } catch (e) {
        log.error(`缓存初始化失败。原因：${e}`);
    }

    await loadTrackData();

    // 隐藏 Splash Screen
    await SplashScreen.hideAsync();

    return "done";
}
