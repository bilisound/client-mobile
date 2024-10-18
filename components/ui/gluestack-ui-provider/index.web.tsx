"use client";
import { setFlushStyles } from "@gluestack-ui/nativewind-utils/flush";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import React, { createContext, useContext } from "react";

import { config } from "./config";

import useSettingsStore from "~/store/settings";

const ThemeValueProvider = createContext<(typeof config)[string] | null>(null);

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

    const themeName = theme + "_" + mode;

    const stringcssvars = Object.keys(config[themeName]).reduce((acc, cur) => {
        acc += `${cur}:${config[themeName][cur]};`;
        return acc;
    }, "");
    setFlushStyles(`:root {${stringcssvars}} `);

    if (config[themeName] && typeof document !== "undefined") {
        const element = document.documentElement;
        if (element) {
            const head = element.querySelector("head");
            const style = document.createElement("style");
            style.innerHTML = `:root {${stringcssvars}} `;
            if (head) head.appendChild(style);
        }
    }

    return (
        <ThemeValueProvider.Provider value={config[theme + "_" + mode]}>
            <OverlayProvider>
                <ToastProvider>{props.children}</ToastProvider>
            </OverlayProvider>
        </ThemeValueProvider.Provider>
    );
}
