import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "core-js/actual/array/to-spliced";
import { PortalProvider } from "@gorhom/portal";
import { ThemeProvider } from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen, Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import React, { useEffect, useRef, useState } from "react";
import { Linking, Platform, useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import { UnistylesRuntime, useInitialTheme, useStyles } from "react-native-unistyles";

import AudioManager from "~/components/AudioManager";
import CheckUpdateDialog from "~/components/CheckUpdateDialog";
import { GluestackUIProvider } from "~/components/ui/gluestack-ui-provider";
import { toastConfig } from "~/config/toast";
import { RELEASE_CHANNEL, VERSION } from "~/constants/releasing";
import useSettingsStore from "~/store/settings";
import { checkLatestVersion } from "~/utils/check-release";
import init from "~/utils/init";
import "~/global.css";
import "~/unistyles";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
    const { theme: currentTheme } = useSettingsStore(state => ({
        theme: state.theme,
    }));
    const colorScheme = useColorScheme();
    const themeName = currentTheme + "_" + (colorScheme === "dark" ? "dark" : "light");

    useInitialTheme(themeName);
    useEffect(() => {
        UnistylesRuntime.setTheme(themeName);
    }, [themeName]);

    const { theme } = useStyles();

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

    const dark = colorScheme === "dark";

    const reactNavigationTheme = {
        dark,
        colors: dark
            ? {
                  primary: theme.colors.primary[500],
                  background: "#171717",
                  card: "#171717",
                  text: "#ffffff",
                  border: "#262626",
                  notification: "red",
              }
            : {
                  primary: theme.colors.primary[500],
                  background: "#ffffff",
                  card: "#ffffff",
                  text: "#000000",
                  border: "#F1F1F1",
                  notification: "red",
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
            <Stack.Screen name="about" options={{ headerShown: false }} />
            <Stack.Screen name="readme" options={{ headerShown: false }} />
            <Stack.Screen name="barcode" options={{ headerShown: false, animation: "fade" }} />
            <Stack.Screen name="notification.click" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={modalSettings} />
            <Stack.Screen name="log-show" options={{ headerShown: false }} />
            <Stack.Screen name="apply-playlist" options={{ headerShown: false }} />
            <Stack.Screen name="remote-list" options={{ headerShown: false }} />
            <Stack.Screen name="theme" options={{ headerShown: false }} />
            <Stack.Screen name="test" options={{ title: "测试页面" }} />
        </Stack>
    );

    return (
        <GluestackUIProvider mode="system">
            <QueryClientProvider client={queryClient}>
                <ThemeProvider value={reactNavigationTheme}>
                    <PortalProvider>
                        {routes}
                        <AudioManager />
                        <Toast config={toastConfig} />
                        {RELEASE_CHANNEL === "android_github" && <CheckUpdate />}
                    </PortalProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </GluestackUIProvider>
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
            // https://stackoverflow.com/questions/74999835/trying-to-make-the-android-navigation-bar-transparent-in-expo
            if (Platform.OS === "android") {
                await NavigationBar.setPositionAsync("absolute");
                await NavigationBar.setBackgroundColorAsync(colorScheme === "dark" ? "#17171701" : "#ffffff01");
            }
            await SystemUI.setBackgroundColorAsync(colorScheme === "dark" ? "#171717" : "#ffffff");
        })();
    }, [colorScheme]);

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
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

    return <RootLayoutNav />;
}
