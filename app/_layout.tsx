import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SystemUI from "expo-system-ui";
import TrackPlayer, { Capability } from "react-native-track-player";
import RNFS from "react-native-fs";
import * as NavigationBar from "expo-navigation-bar";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";

import AudioManager from "../components/AudioManager";
import { initPlaybackService } from "../utils/player-control";
import { BILISOUND_LOG_PATH, BILISOUND_OFFLINE_PATH } from "../constants/file";
import { loadTrackData } from "../utils/track-data";
import { config } from "../config/gluestack-ui.config";
import log from "../utils/logger";
import useSettingsStore from "../store/settings";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

(async () => {
    // 日志系统初始化
    await useSettingsStore.persist.rehydrate();
    const settings = useSettingsStore.getState();
    console.log(settings);
    log.setSeverity(settings.debugMode ? "debug" : "info");

    // 目录初始化
    try {
        await RNFS.mkdir(BILISOUND_LOG_PATH);
        await RNFS.mkdir(BILISOUND_OFFLINE_PATH);
        log.debug("目录初始化成功");
    } catch (e) {
        log.error(`目录初始化失败。原因：${e}`);
    }

    // 播放器初始化
    try {
        initPlaybackService();
        log.debug("播放服务初始化成功");
    } catch (e) {
        log.error(`播放服务注册失败。原因：${e}`);
    }
    log.debug("初始化完毕！");
})();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayoutNav = () => {
    const colorScheme = useColorScheme();

    // 初始化界面
    (async ()=> {
        // https://stackoverflow.com/questions/74999835/trying-to-make-the-android-navigation-bar-transparent-in-expo
        if (Platform.OS === "android") {
            await NavigationBar.setPositionAsync("absolute");
            await NavigationBar.setBackgroundColorAsync(colorScheme === "dark" ? "#00262401" : "#ffffff01");
        }
        await SystemUI.setBackgroundColorAsync(colorScheme === "dark" ? "#000" : "#00a48e");
    })();

    const modalSettings: any =
        Platform.OS === "ios"
            ? {
                  presentation: "modal",
                  statusBarStyle: "dark",
                  headerShown: false,
              }
            : {
                  headerShown: false,
                  animation: "slide_from_bottom",
              };

    return (
        <>
            <GluestackUIProvider config={config} colorMode={(colorScheme ?? "light") as COLORMODES}>
                <SafeAreaProvider>
                    <Stack
                        screenOptions={{
                            contentStyle: {
                                backgroundColor: colorScheme === "dark" ? "#002624" : "#fff",
                            },
                        }}
                    >
                        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "slide_from_right" }} />
                        <Stack.Screen
                            name="query/[id]"
                            options={{ headerShown: false, animation: "slide_from_right" }}
                        />
                        <Stack.Screen name="history" options={{ headerShown: false, animation: "slide_from_right" }} />
                        {/* <Stack.Screen name="settings" options={{ headerShown: false }} /> */}
                        <Stack.Screen name="about" options={{ headerShown: false, animation: "slide_from_right" }} />
                        <Stack.Screen name="readme" options={{ headerShown: false, animation: "slide_from_right" }} />
                        <Stack.Screen name="barcode" options={{ headerShown: false, animation: "fade" }} />
                        <Stack.Screen
                            name="notification.click"
                            options={{ headerShown: false, animation: "slide_from_right" }}
                        />
                        <Stack.Screen name="modal" options={modalSettings} />
                        <Stack.Screen name="log-show" options={{ headerShown: false, animation: "slide_from_right" }} />
                    </Stack>
                    <AudioManager />
                </SafeAreaProvider>
            </GluestackUIProvider>
        </>
    );
};

const RootLayout: React.FC = () => {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    // 各种初始化操作（程序加载后）
    useEffect(() => {
        if (!loaded) {
            return;
        }
        (async () => {
            // 初始化播放器
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

                // 还原播放列表
                try {
                    await loadTrackData();
                } catch (e) {
                    log.error(`播放列表初始化失败。原因：${e}`);
                }
            } catch (e) {
                log.warn(`播放器初始化失败（通常是播放器已经初始化过了）。错误信息：${e}`);
            }
            SplashScreen.hideAsync();
        })();
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
};

export default RootLayout;
