import { SplashScreen } from "expo-router";

import log from "./logger";
import useSettingsStore from "../store/settings";

import { initDatabase } from "~/storage/sqlite/init-web";

export default async function init() {
    // 日志系统初始化
    await useSettingsStore.persist.rehydrate();
    const settings = useSettingsStore.getState();
    log.setSeverity(settings.debugMode ? "debug" : "info");

    // 数据库初始化
    await initDatabase();

    // 隐藏 Splash Screen
    await SplashScreen.hideAsync();

    return "done";
}
