import * as twColors from "tailwindcss/colors";

export interface ColorPalettes {
    primary: ColorPalette;
    accent: ColorPalette;

    // Tailwind Colors
    white: "#ffffff";
    black: "#000000";
    inherit: "inherit";
    current: "currentColor";
    transparent: "transparent";
    slate: ColorPalette;
    gray: ColorPalette;
    zinc: ColorPalette;
    neutral: ColorPalette;
    stone: ColorPalette;
    red: ColorPalette;
    orange: ColorPalette;
    amber: ColorPalette;
    yellow: ColorPalette;
    lime: ColorPalette;
    green: ColorPalette;
    emerald: ColorPalette;
    teal: ColorPalette;
    cyan: ColorPalette;
    sky: ColorPalette;
    blue: ColorPalette;
    indigo: ColorPalette;
    violet: ColorPalette;
    purple: ColorPalette;
    fuchsia: ColorPalette;
    pink: ColorPalette;
    rose: ColorPalette;
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

// 提取 ColorPalette 类型的键
export type ColorPaletteKeys<T> = {
    [K in keyof T]: T[K] extends ColorPalette ? K : never;
}[keyof T];

// 使用 ColorPaletteKeys 提取 ThemeColor 中的 ColorPalette 键
export type ThemeColorPaletteKeys = ColorPaletteKeys<ColorPalettes>;

export const colors: ColorPalettes = {
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
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
        950: "#172554",
    },
    inherit: "inherit",
    current: "currentColor",
    transparent: "transparent",
    black: "#000000",
    white: "#ffffff",
    slate: twColors.slate,
    gray: twColors.gray,
    zinc: twColors.zinc,
    neutral: twColors.neutral,
    stone: twColors.stone,
    red: twColors.red,
    orange: twColors.orange,
    amber: twColors.amber,
    yellow: twColors.yellow,
    lime: twColors.lime,
    green: twColors.green,
    emerald: twColors.emerald,
    teal: twColors.teal,
    cyan: twColors.cyan,
    sky: twColors.sky,
    blue: twColors.blue,
    indigo: twColors.indigo,
    violet: twColors.violet,
    purple: twColors.purple,
    fuchsia: twColors.fuchsia,
    pink: twColors.pink,
    rose: twColors.rose,
};
