import "~/utils/polyfill";

import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { PortalProvider } from "@gorhom/portal";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen, Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { merge } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Linking, Platform, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import AudioManager from "~/components/AudioManager";
import CheckUpdateDialog from "~/components/CheckUpdateDialog";
import { GluestackUIProvider } from "~/components/ui/gluestack-ui-provider";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { toastConfig } from "~/config/toast";
import { RELEASE_CHANNEL, VERSION } from "~/constants/releasing";
import { checkLatestVersion } from "~/utils/check-release";
import init from "~/utils/init";
import "~/global.css";
import "~/utils/nativewind";
import log from "~/utils/logger";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

setInterval(() => {
    NavigationBar.setPositionAsync("absolute");
    NavigationBar.setBackgroundColorAsync("#ffffff01");
}, 100);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// LogBox.ignoreAllLogs(true);

// Query Client
const queryClient = new QueryClient();

function CheckUpdate() {
    // 检查更新处理
    const [modalVisible, setModalVisible] = useState(false);
    const { data } = useQuery({
        queryKey: ["check_update"],
        queryFn: () => checkLatestVersion(VERSION),
        staleTime: 86400_000,
    });

    function handleClose(positive: boolean) {
        setModalVisible(false);
        if (positive) {
            Linking.openURL(data!.downloadUrl);
        }
    }

    useEffect(() => {
        if (data && !data.isLatest) {
            setModalVisible(true);
        }
    }, [data, setModalVisible]);

    return <CheckUpdateDialog open={modalVisible} onClose={handleClose} result={data} />;
}

const RootLayoutNav = () => {
    const { colorValue, mode } = useRawThemeValues();
    const edgeInsets = useSafeAreaInsets();

    const modalSettings: NativeStackNavigationOptions =
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

    const dark = mode === "dark";

    const reactNavigationTheme = {
        dark,
        colors: dark
            ? {
                  primary: colorValue("--color-primary-500"),
                  background: "#171717",
                  card: "#171717",
                  text: "#ffffff",
                  border: "#262626",
              }
            : {
                  primary: colorValue("--color-primary-400"),
                  background: "#ffffff",
                  card: "#ffffff",
                  text: "#000000",
                  border: "#F1F1F1",
              },
    };

    const routes = (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="query/[id]" options={{ headerShown: false }} />
            <Stack.Screen
                name="history"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen name="barcode" options={{ headerShown: false, animation: "fade" }} />
            <Stack.Screen name="notification.click" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={modalSettings} />
            <Stack.Screen name="apply-playlist" options={{ headerShown: false }} />
            <Stack.Screen name="remote-list" options={{ headerShown: false }} />
            <Stack.Screen name="settings/about" options={{ title: "关于", headerShown: false }} />
            <Stack.Screen name="settings/license" options={{ title: "开源软件使用声明", headerShown: false }} />
            <Stack.Screen name="settings/log-show" options={{ title: "导出日志", headerShown: false }} />
            <Stack.Screen name="settings/theme" options={{ title: "外观设置", headerShown: false }} />
            <Stack.Screen name="settings/data" options={{ title: "数据管理", headerShown: false }} />
            <Stack.Screen name="settings/lab" options={{ title: "实验性功能", headerShown: false }} />
            <Stack.Screen name="test" options={{ title: "测试页面", headerShown: false }} />
        </Stack>
    );

    return (
        <ThemeProvider value={merge(DefaultTheme, reactNavigationTheme)}>
            {routes}
            <AudioManager />
            <Toast config={toastConfig} topOffset={edgeInsets.top} />
            {RELEASE_CHANNEL === "android_github" && <CheckUpdate />}
        </ThemeProvider>
    );
};

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
    });

    const isInitializing = useRef(false);
    const colorScheme = useColorScheme();

    useEffect(() => {
        (async () => {
            await SystemUI.setBackgroundColorAsync(
                colorScheme === "dark" || Platform.OS === "ios" ? "#171717" : "#ffffff",
            );
        })();
    }, [colorScheme]);

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) {
            log.error("捕捉到未处理的错误：" + (error?.message || error) + " ，调用栈：" + error?.stack);
        }
        if (error && process.env.NODE_ENV !== "production") {
            throw error;
        }
    }, [error]);

    // 各种初始化操作（程序加载后）
    useEffect(() => {
        if (!loaded || isInitializing.current) {
            return;
        }
        isInitializing.current = true;
        init();
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <GluestackUIProvider mode={colorScheme || "light"}>
            <QueryClientProvider client={queryClient}>
                <PortalProvider>
                    <RootLayoutNav />
                </PortalProvider>
            </QueryClientProvider>
        </GluestackUIProvider>
    );
}
