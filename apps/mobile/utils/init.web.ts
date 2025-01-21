import { SplashScreen } from "expo-router";

import log from "./logger";
import useSettingsStore from "../store/settings";

import { initDatabase } from "~/storage/sqlite/init-web";
import { loadTrackData } from "~/business/playlist/handler";

export default async function init() {
    // 日志系统初始化
    await useSettingsStore.persist.rehydrate();
    const settings = useSettingsStore.getState();
    log.setSeverity(settings.debugMode ? "debug" : "info");

    // 数据库初始化
    await initDatabase();

    // 播放队列初始化
    await loadTrackData();

    // 隐藏 Splash Screen
    await SplashScreen.hideAsync();

    return "done";
}
