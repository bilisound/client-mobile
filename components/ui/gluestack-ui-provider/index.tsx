import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import React, { createContext, useContext } from "react";
import { View } from "react-native";

import { config, ConfigName, parsedConfig } from "./config";

import { ThemeValueProvider } from "~/components/ui/gluestack-ui-provider/theme";
import useSettingsStore from "~/store/settings";

export function GluestackUIProvider({ mode = "light", ...props }: { mode?: "light" | "dark"; children?: any }) {
    const { theme } = useSettingsStore(state => ({
        theme: state.theme,
    }));

    return (
        <View
            style={[
                parsedConfig[theme + "_" + mode],
                { flex: 1, height: "100%", width: "100%" },
                // @ts-ignore
                props.style,
            ]}
        >
            <ThemeValueProvider.Provider
                value={{
                    theme: config[(theme + "_" + mode) as ConfigName],
                    mode,
                }}
            >
                <OverlayProvider>
                    <ToastProvider>{props.children}</ToastProvider>
                </OverlayProvider>
            </ThemeValueProvider.Provider>
        </View>
    );
}
