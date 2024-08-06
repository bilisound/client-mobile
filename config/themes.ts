export interface BilisoundTheme {
    colors: BilisoundThemeColor;
}

export interface BilisoundThemeColor {
    primary: ColorPalette;
    accent: ColorPalette;
    neutral: ColorPalette;
}

export interface ColorPalette {
    "50": string;
    "100": string;
    "200": string;
    "300": string;
    "400": string;
    "500": string;
    "600": string;
    "700": string;
    "800": string;
    "900": string;
    "950": string;
}

export interface ColorToken {}

export const classicLight: BilisoundTheme = {
    colors: {
        primary: {
            "50": "#eefffa",
            "100": "#c6fff1",
            "200": "#8effe6",
            "300": "#4dfbd8",
            "400": "#19e8c4",
            "500": "#00ba9d",
            "600": "#00a48e",
            "700": "#028373",
            "800": "#08675d",
            "900": "#0c554d",
            "950": "#003431",
        },
        accent: {
            "50": "#f0f8ff",
            "100": "#e0f0fe",
            "200": "#b9e1fe",
            "300": "#7cc9fd",
            "400": "#36affa",
            "500": "#0c95eb",
            "600": "#006bb8",
            "700": "#015ca3",
            "800": "#064f86",
            "900": "#0b426f",
            "950": "#072a4a",
        },
        neutral: {
            "50": "#fafafa",
            "100": "#f5f5f5",
            "200": "#e5e5e5",
            "300": "#d4d4d4",
            "400": "#a3a3a3",
            "500": "#737373",
            "600": "#525252",
            "700": "#404040",
            "800": "#262626",
            "900": "#171717",
            "950": "#0a0a0a",
        },
    },
} as const;

export const classicDark: BilisoundTheme = {
    colors: {
        primary: {
            "50": "#eefffa",
            "100": "#c6fff1",
            "200": "#8effe6",
            "300": "#4dfbd8",
            "400": "#19e8c4",
            "500": "#00ba9d",
            "600": "#00a48e",
            "700": "#028373",
            "800": "#08675d",
            "900": "#0c554d",
            "950": "#003431",
        },
        accent: {
            "50": "#f0f8ff",
            "100": "#e0f0fe",
            "200": "#b9e1fe",
            "300": "#7cc9fd",
            "400": "#36affa",
            "500": "#0c95eb",
            "600": "#006bb8",
            "700": "#015ca3",
            "800": "#064f86",
            "900": "#0b426f",
            "950": "#072a4a",
        },
        neutral: {
            "50": "#fafafa",
            "100": "#f5f5f5",
            "200": "#e5e5e5",
            "300": "#d4d4d4",
            "400": "#a3a3a3",
            "500": "#737373",
            "600": "#525252",
            "700": "#404040",
            "800": "#262626",
            "900": "#171717",
            "950": "#0a0a0a",
        },
    },
} as const;
