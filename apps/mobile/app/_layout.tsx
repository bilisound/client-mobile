import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import "~/global.css";
import { GluestackUIProvider } from "~/components/ui/gluestack-ui-provider";
import React, { useEffect, useRef, useState } from "react";
import { Linking, Platform, useColorScheme, useWindowDimensions } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SystemBars } from "react-native-edge-to-edge";
import { useFonts } from "expo-font";
import log from "~/utils/logger";
import init from "~/utils/init";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import * as Player from "@bilisound/player";
import "~/utils/polyfill";
import "~/utils/nativewind";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { registerBackgroundEventListener } from "@bilisound/player";
import { toastConfig } from "~/components/notify-toast";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { refreshCurrentTrack, saveCurrentAndNextTrack, saveTrackData } from "~/business/playlist/handler";
import * as NavigationBar from "expo-navigation-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { MainBottomSheet } from "~/components/main-bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorToastHost } from "~/components/error-toast-host";
import CheckUpdateDialog from "~/components/check-update-dialog";
import { checkLatestVersion } from "~/business/check-release";
import { VERSION } from "~/constants/releasing";

// todo 把它们放到主题管理模块里
const defaultTheme = structuredClone(DefaultTheme);
defaultTheme.colors.background = "#ffffff";
defaultTheme.colors.primary = "#00ba9d";

const darkTheme = structuredClone(DarkTheme);
darkTheme.colors.background = "#121212";
darkTheme.colors.primary = "#00ba9d";

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
    initialRouteName: "(main)",
};

registerBackgroundEventListener(async ({ event, data }) => {
    if (event === "onTrackChange") {
        // console.log(event, data);
        const trackData = await Player.getCurrentTrack();
        if (!trackData) {
            return;
        }
        await refreshCurrentTrack();
        await saveTrackData();
        await saveCurrentAndNextTrack();
    }
});

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

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
        Poppins_700Bold,
    });

    const isInitializing = useRef(false);
    const colorScheme = useColorScheme();
    const edgeInsets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();

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

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(colorScheme === "dark" ? "#121212" : "#ffffff");
    }, [colorScheme]);

    useEffect(() => {
        (async () => {
            await SystemUI.setBackgroundColorAsync(
                colorScheme === "dark" || Platform.OS === "ios" ? "#171717" : "#ffffff",
            );
        })();

        // 解决在 Xiaomi HyperOS 上底部 navigation bar 亮色模式下始终为半透明白色背景的问题。在「原生安卓」下其实不需要这一步
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (Platform.OS === "android" && Platform.Version <= 14) {
            timer = setTimeout(async () => {
                // https://stackoverflow.com/questions/74999835/trying-to-make-the-android-navigation-bar-transparent-in-expo
                await NavigationBar.setPositionAsync("absolute");
                await NavigationBar.setBackgroundColorAsync(colorScheme === "dark" ? "#17171701" : "#ffffff01");
            }, 100);
        }

        return () => clearTimeout(timer);
    }, [colorScheme, width, height]);

    if (!loaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GluestackUIProvider mode={(colorScheme ?? "light") as "light" | "dark"}>
                <ThemeProvider value={colorScheme === "dark" ? darkTheme : defaultTheme}>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <BottomSheetModalProvider>
                            <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                }}
                            >
                                <Stack.Screen
                                    name={"(main)"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"video/[id]"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"settings/about"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"settings/data"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"settings/theme"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"remote-list"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"apply-playlist"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"barcode"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"history"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name={"test"}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="description"
                                    options={{
                                        presentation: "formSheet",
                                        sheetAllowedDetents: "fitToContents",
                                        gestureEnabled: false,
                                    }}
                                />
                            </Stack>
                            <MainBottomSheet />
                            <ErrorToastHost />
                            <CheckUpdate />
                            <Toast config={toastConfig} topOffset={edgeInsets.top} />
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </ThemeProvider>
            </GluestackUIProvider>
        </QueryClientProvider>
    );
}
