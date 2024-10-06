import * as twColors from "tailwindcss/colors";

import { ColorPalettes, colors, ThemeColorPaletteKeys } from "~/config/palettes";

export interface BilisoundTheme {
    colorScheme: "light" | "dark";
    colors: ColorPalettes;
    colorTokens: SemanticColor;
    sizes: SemanticSizes;
}

export type ButtonStatus = "default" | "hover" | "active" | "disabled";

export interface SemanticColor {
    background: string;
    foreground: string;
    topBarSolidBackground: string;
    topBarSolidForeground: string;
    topBarTransparentForeground: string;
    dialogBackground: string;
    dialogBorder: string;
    toastBackground: string;
    toastBorder: string;
    border: string;
    buttonBackground: (color: ThemeColorPaletteKeys, status: ButtonStatus) => string;
    buttonForeground: (color: ThemeColorPaletteKeys, status: ButtonStatus) => string;
    buttonOutlineBackground: (color: ThemeColorPaletteKeys, status: ButtonStatus) => string;
    buttonOutlineForeground: (color: ThemeColorPaletteKeys, status: ButtonStatus) => string;
    buttonOutlineBorder: (color: ThemeColorPaletteKeys, status: ButtonStatus) => string;
}

export interface SemanticSizes {
    radiusButton: number;
    radiusButtonFull: number;
}

const colorsRed = {
    ...colors,
    primary: {
        "50": "#fef2f2",
        "100": "#fde6e7",
        "200": "#fad1d4",
        "300": "#f6abb1",
        "400": "#f07c88",
        "500": "#e64f62",
        "600": "#d22c49",
        "700": "#b0203c",
        "800": "#941d39",
        "900": "#7f1c37",
        "950": "#460b18",
    },
    accent: twColors.orange,
};

export const classicLight: BilisoundTheme = {
    colorScheme: "light",
    colors,
    sizes: {
        radiusButton: 8,
        radiusButtonFull: 9999,
    },
    colorTokens: {
        background: colors.white,
        foreground: colors.neutral[700],
        border: colors.neutral[100],
        topBarSolidBackground: colors.primary[500],
        topBarSolidForeground: colors.white,
        topBarTransparentForeground: colors.primary[500],
        dialogBackground: colors.white,
        dialogBorder: colors.neutral[100],
        toastBackground: colors.white,
        toastBorder: colors.neutral[100],
        buttonBackground: (color, status) => {
            switch (status) {
                case "default":
                    return colors[color][500];
                case "hover":
                    return colors[color][600];
                case "active":
                    return colors[color][700];
                case "disabled":
                    return colors[color][200];
                default:
                    return colors[color][500];
            }
        },
        buttonForeground: (color, status) => {
            if (status === "disabled") {
                return colors[color][700];
            }
            return colors.white;
        },
        buttonOutlineBackground: (color, status) => {
            switch (status) {
                case "default":
                    return colors.transparent;
                case "hover":
                    return colors[color][50];
                case "active":
                    return colors[color][100];
                case "disabled":
                    return colors.transparent;
                default:
                    return colors.transparent;
            }
        },
        buttonOutlineForeground: (color, status) => {
            return colors[color][700];
        },
        buttonOutlineBorder: (color, status) => {
            return colors[color][700];
        },
    },
} as const;

export const classicDark: BilisoundTheme = {
    ...classicLight,
    colorScheme: "dark",
    colorTokens: {
        background: colors.neutral["900"],
        foreground: colors.neutral["200"],
        border: colors.neutral["800"],
        topBarSolidBackground: colors.primary["900"],
        topBarSolidForeground: colors.white,
        topBarTransparentForeground: colors.primary[500],
        dialogBackground: colors.neutral["900"],
        dialogBorder: colors.neutral[800],
        toastBackground: colors.neutral["800"],
        toastBorder: colors.neutral[800],
        buttonBackground: (color, status) => {
            switch (status) {
                case "default":
                    return colors[color][400];
                case "hover":
                    return colors[color][300];
                case "active":
                    return colors[color][500];
                case "disabled":
                    return colors[color][800];
                default:
                    return colors[color][400];
            }
        },
        buttonForeground: (color, status) => {
            if (status === "disabled") {
                return colors[color][100];
            }
            return colors[color][950];
        },
        buttonOutlineBackground: (color, status) => {
            switch (status) {
                case "default":
                    return colors.transparent;
                case "hover":
                    return colors[color][950];
                case "active":
                    return colors[color][900];
                case "disabled":
                    return colors.transparent;
                default:
                    return colors.transparent;
            }
        },
        buttonOutlineForeground: (color, status) => {
            return colors[color][300];
        },
        buttonOutlineBorder: (color, status) => {
            return colors[color][300];
        },
    },
};

export const redLight: BilisoundTheme = {
    colorScheme: "light",
    colors: colorsRed,
    sizes: {
        radiusButton: 8,
        radiusButtonFull: 9999,
    },
    colorTokens: {
        background: colorsRed.white,
        foreground: colorsRed.neutral[700],
        border: colorsRed.neutral[100],
        topBarSolidBackground: colorsRed.primary[500],
        topBarSolidForeground: colorsRed.white,
        topBarTransparentForeground: colorsRed.primary[500],
        dialogBackground: colorsRed.white,
        dialogBorder: colorsRed.neutral[100],
        toastBackground: colorsRed.white,
        toastBorder: colorsRed.neutral[100],
        buttonBackground: (color, status) => {
            switch (status) {
                case "default":
                    return colorsRed[color][500];
                case "hover":
                    return colorsRed[color][600];
                case "active":
                    return colorsRed[color][700];
                case "disabled":
                    return colorsRed[color][200];
                default:
                    return colorsRed[color][500];
            }
        },
        buttonForeground: (color, status) => {
            if (status === "disabled") {
                return colorsRed[color][700];
            }
            return colorsRed.white;
        },
        buttonOutlineBackground: (color, status) => {
            switch (status) {
                case "default":
                    return colorsRed.transparent;
                case "hover":
                    return colorsRed[color][50];
                case "active":
                    return colorsRed[color][100];
                case "disabled":
                    return colorsRed.transparent;
                default:
                    return colorsRed.transparent;
            }
        },
        buttonOutlineForeground: (color, status) => {
            return colorsRed[color][700];
        },
        buttonOutlineBorder: (color, status) => {
            return colorsRed[color][700];
        },
    },
} as const;

export const redDark: BilisoundTheme = {
    ...redLight,
    colorScheme: "dark",
    colorTokens: {
        background: colorsRed.neutral["900"],
        foreground: colorsRed.neutral["200"],
        border: colorsRed.neutral["800"],
        topBarSolidBackground: colorsRed.primary["900"],
        topBarSolidForeground: colorsRed.white,
        topBarTransparentForeground: colorsRed.primary[500],
        dialogBackground: colorsRed.neutral["900"],
        dialogBorder: colorsRed.neutral[800],
        toastBackground: colorsRed.neutral["800"],
        toastBorder: colorsRed.neutral[800],
        buttonBackground: (color, status) => {
            switch (status) {
                case "default":
                    return colorsRed[color][400];
                case "hover":
                    return colorsRed[color][300];
                case "active":
                    return colorsRed[color][500];
                case "disabled":
                    return colorsRed[color][800];
                default:
                    return colorsRed[color][400];
            }
        },
        buttonForeground: (color, status) => {
            if (status === "disabled") {
                return colorsRed[color][100];
            }
            return colorsRed[color][950];
        },
        buttonOutlineBackground: (color, status) => {
            switch (status) {
                case "default":
                    return colorsRed.transparent;
                case "hover":
                    return colorsRed[color][950];
                case "active":
                    return colorsRed[color][900];
                case "disabled":
                    return colorsRed.transparent;
                default:
                    return colorsRed.transparent;
            }
        },
        buttonOutlineForeground: (color, status) => {
            return colorsRed[color][300];
        },
        buttonOutlineBorder: (color, status) => {
            return colorsRed[color][300];
        },
    },
};
