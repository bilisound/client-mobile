import { createContext, useContext } from "react";

import { ColorSchemeName, config, ConfigDetail, ConfigName } from "./config";

interface ThemeValue {
    theme: (typeof config)[ConfigName];
    mode: ColorSchemeName;
}

export const ThemeValueProvider = createContext<ThemeValue | null>(null);

export function useRawThemeValues() {
    const values = useContext(ThemeValueProvider);
    if (!values) {
        throw new Error("useRawThemeValues must be used within ThemeValueProvider");
    }

    const colorValue = (color: keyof ConfigDetail, opacity = 1) => {
        return `rgba(${values.theme[color]} / ${opacity})`;
    };

    return { values: values.theme, mode: values.mode, colorValue };
}
