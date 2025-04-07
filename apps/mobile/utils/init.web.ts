import { SplashScreen } from "expo-router";

import log from "./logger";
import useSettingsStore from "../store/settings";

import { loadTrackData } from "~/business/playlist/handler";
import { initPolyfill } from "@bilisound/player/src/polyfill";
import { handlePlaylist } from "~/utils/migration/playlist";

export default async function init() {
    // 日志系统初始化
    await useSettingsStore.persist.rehydrate();
    const settings = useSettingsStore.getState();
    log.setSeverity(settings.debugMode ? "debug" : "info");

    // 歌单数据库初始化
    try {
        await handlePlaylist();
        log.debug("数据库初始化成功");
    } catch (e) {
        log.error(`数据库初始化失败。原因：${e}`);
    }

    // 播放队列初始化
    initPolyfill();
    await loadTrackData();

    // 隐藏 Splash Screen
    await SplashScreen.hideAsync();

    return "done";
}
