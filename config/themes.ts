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
    dialogBackground: string;
    dialogBorder: string;
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
        dialogBackground: colors.white,
        dialogBorder: colors.neutral[100],
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
        foreground: colors.white,
        border: colors.neutral["800"],
        topBarSolidBackground: colors.primary["900"],
        dialogBackground: colors.neutral["800"],
        dialogBorder: colors.neutral[800],
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
