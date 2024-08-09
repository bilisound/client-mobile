// Polyfill
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "core-js/actual/array/to-spliced";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { ThemeProvider } from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen, Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import React, { useEffect, useRef } from "react";
import { Platform, useColorScheme } from "react-native";
import Toast from "react-native-toast-message";

import AudioManager from "~/components/AudioManager";
import { config } from "~/config/gluestack-ui.config";
import init from "~/utils/init";

// Initialize styles
import "~/unistyles";
import { UnistylesRuntime, useInitialTheme } from "react-native-unistyles";

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

const RootLayoutNav = () => {
    const colorScheme = useColorScheme();

    useInitialTheme(colorScheme === "dark" ? "dark" : "light");

    useEffect(() => {
        UnistylesRuntime.setTheme(colorScheme === "dark" ? "dark" : "light");
    }, [colorScheme]);

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

    const theme = {
        dark,
        colors: dark
            ? {
                  primary: "#00a48e",
                  background: "#171717",
                  card: "#171717",
                  text: "#ffffff",
                  border: "#262626",
                  notification: "red",
              }
            : {
                  primary: "#00a48e",
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
            <Stack.Screen name="test" options={{ title: "测试页面" }} />
        </Stack>
    );

    return (
        <GluestackUIProvider config={config} colorMode={(colorScheme ?? "light") as COLORMODES}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider value={theme}>
                    {routes}
                    <AudioManager />
                    <Toast />
                </ThemeProvider>
            </QueryClientProvider>
        </GluestackUIProvider>
    );
};

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
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
