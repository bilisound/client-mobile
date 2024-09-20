import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import { colorScheme as colorSchemeNW } from "nativewind";
import React, { createContext, useContext } from "react";
import { ColorSchemeName, useColorScheme, View, ViewProps } from "react-native";

import { config } from "./config";

import useSettingsStore from "~/store/settings";

type ModeType = "light" | "dark" | "system";

const getColorSchemeName = (colorScheme: ColorSchemeName, mode: ModeType): "light" | "dark" => {
    if (mode === "system") {
        return colorScheme ?? "light";
    }
    return mode;
};

const ThemeValueProvider = createContext<(typeof config)[string] | null>(null);

export function useRawThemeValues() {
    const data = useContext(ThemeValueProvider);
    if (!data) {
        throw new Error("useRawThemeValues must be used within ThemeValueProvider");
    }

    return data;
}

export function GluestackUIProvider({
    mode = "light",
    ...props
}: {
    mode?: "light" | "dark" | "system";
    children?: React.ReactNode;
    style?: ViewProps["style"];
}) {
    const { theme } = useSettingsStore(state => ({
        theme: state.theme,
    }));

    const colorScheme = useColorScheme();

    const colorSchemeName = getColorSchemeName(colorScheme, mode);

    colorSchemeNW.set(mode);

    return (
        <View style={[config[theme + "_" + colorSchemeName], { flex: 1, height: "100%", width: "100%" }, props.style]}>
            <ThemeValueProvider.Provider value={config[theme + "_" + colorSchemeName]}>
                <OverlayProvider>
                    <ToastProvider>{props.children}</ToastProvider>
                </OverlayProvider>
            </ThemeValueProvider.Provider>
        </View>
    );
}
