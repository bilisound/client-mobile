import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { COLORMODES } from "@gluestack-style/react/lib/typescript/types";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen, Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import React, { useEffect, useRef } from "react";
import { Platform, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AudioManager from "../components/AudioManager";
import { config } from "../config/gluestack-ui.config";
import init from "../utils/init";

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
        <GluestackUIProvider config={config} colorMode={(colorScheme ?? "light") as COLORMODES}>
            <QueryClientProvider client={queryClient}>
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
            </QueryClientProvider>
        </GluestackUIProvider>
    );
};

const RootLayout: React.FC = () => {
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
                await NavigationBar.setBackgroundColorAsync(colorScheme === "dark" ? "#00262401" : "#ffffff01");
            }
            await SystemUI.setBackgroundColorAsync(colorScheme === "dark" ? "#000" : "#00a48e");
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
};

export default RootLayout;
