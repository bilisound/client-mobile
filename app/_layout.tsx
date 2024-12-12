import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import "~/global.css";
import { GluestackUIProvider } from "~/components/ui/gluestack-ui-provider";
import React, { useEffect, useRef } from "react";
import { Platform, useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import * as Player from "@bilisound/player";
import { SystemBars } from "react-native-edge-to-edge";
import { useFonts } from "expo-font";
import log from "~/utils/logger";
import init from "~/utils/init";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";

import "~/utils/polyfill";
import "~/utils/nativewind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { USER_AGENT_BILIBILI } from "~/constants/network";

// todo 目前不对播放生效
Player.setDefaultHeaders({
    "User-Agent": USER_AGENT_BILIBILI,
});

if (Platform.OS === "android") {
    setInterval(() => {
        NavigationBar.setPositionAsync("absolute");
        NavigationBar.setBackgroundColorAsync("#ffffff01");
    }, 100);
}

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

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
        Poppins_700Bold,
    });

    const isInitializing = useRef(false);
    const colorScheme = useColorScheme();

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

    if (!loaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GluestackUIProvider mode={(colorScheme ?? "light") as "light" | "dark"}>
                <ThemeProvider value={colorScheme === "dark" ? darkTheme : defaultTheme}>
                    <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
                    <Stack>
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
                            name={"remote-list"}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={"index2"}
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
                </ThemeProvider>
            </GluestackUIProvider>
        </QueryClientProvider>
    );
}
