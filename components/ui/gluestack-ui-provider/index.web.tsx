"use client";
import { setFlushStyles } from "@gluestack-ui/nativewind-utils/flush";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import React, { useId } from "react";

import { config, ConfigName, parsedConfig } from "./config";
import { ThemeValueProvider } from "./theme";

import useSettingsStore from "~/store/settings";

export function GluestackUIProvider({ mode = "light", ...props }: { mode?: "light" | "dark"; children?: any }) {
    const { theme } = useSettingsStore(state => ({
        theme: state.theme,
    }));
    const themeUniqueId = useId();

    const themeName = theme + "_" + mode;

    const stringcssvars = Object.keys(parsedConfig[themeName]).reduce((acc, cur) => {
        acc += `${cur}:${parsedConfig[themeName][cur]};`;
        return acc;
    }, "");
    setFlushStyles(`:root {${stringcssvars}} `);

    if (parsedConfig[themeName] && typeof document !== "undefined") {
        const element = document.documentElement;
        if (element) {
            const head = element.querySelector("head");
            let style = document.getElementById(themeUniqueId) as HTMLStyleElement | null;
            if (!style) {
                style = document.createElement("style");
                style.id = themeUniqueId;
            }
            style.innerHTML = `:root {${stringcssvars}} `;
            if (head) head.appendChild(style);
        }
    }

    return (
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
    );
}
