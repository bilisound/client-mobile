import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import React, { createContext, useContext } from "react";
import { View } from "react-native";

import { config } from "./config";

import useSettingsStore from "~/store/settings";

const ThemeValueProvider = createContext<(typeof config)[string] | null>(null);

// todo 坏的，取不到值
export function useRawThemeValues() {
    const data = useContext(ThemeValueProvider);
    if (!data) {
        throw new Error("useRawThemeValues must be used within ThemeValueProvider");
    }

    return data;
}

export function GluestackUIProvider({ mode = "light", ...props }: { mode?: "light" | "dark"; children?: any }) {
    const { theme } = useSettingsStore(state => ({
        theme: state.theme,
    }));

    console.log(config);

    return (
        <View
            style={[
                config[theme + "_" + mode],
                { flex: 1, height: "100%", width: "100%" },
                // @ts-ignore
                props.style,
            ]}
        >
            <ThemeValueProvider.Provider value={config[theme + "_" + mode]}>
                <OverlayProvider>
                    <ToastProvider>{props.children}</ToastProvider>
                </OverlayProvider>
            </ThemeValueProvider.Provider>
        </View>
    );
}
