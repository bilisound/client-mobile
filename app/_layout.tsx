import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import "~/global.css";
import { GluestackUIProvider } from "~/components/ui/gluestack-ui-provider";
import React, { useEffect, useRef } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SystemBars } from "react-native-edge-to-edge";
import { useFonts } from "expo-font";
import log from "~/utils/logger";
import init from "~/utils/init";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { Poppins_700Bold } from "@expo-google-fonts/poppins";
import { ToastConfig } from "react-native-toast-message/lib/src/types";

import "~/utils/polyfill";
import "~/utils/nativewind";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerBackgroundEventListener } from "@bilisound/player";
import { NotifyToast } from "~/components/notify-toast";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

registerBackgroundEventListener(() => {});

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

const toastConfig: ToastConfig = {
    success: ({ text1, text2 }) => <NotifyToast type="success" title={text1 ?? ""} description={text2} />,
    info: ({ text1, text2 }) => <NotifyToast type="info" title={text1 ?? ""} description={text2} />,
    warning: ({ text1, text2 }) => <NotifyToast type="warning" title={text1 ?? ""} description={text2} />,
    error: ({ text1, text2 }) => <NotifyToast type="error" title={text1 ?? ""} description={text2} />,
};

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
        Poppins_700Bold,
    });

    const isInitializing = useRef(false);
    const colorScheme = useColorScheme();
    const edgeInsets = useSafeAreaInsets();

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
                    <Toast config={toastConfig} topOffset={edgeInsets.top} />
                </ThemeProvider>
            </GluestackUIProvider>
        </QueryClientProvider>
    );
}
