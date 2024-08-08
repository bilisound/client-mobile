export const SCREEN_BREAKPOINTS = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
} as const;

export const COMMON_TOUCH_COLOR = {
    ":hover": {
        bg: "#00000010",
    },
    ":active": {
        bg: "#00000010",
    },
    _dark: {
        ":hover": {
            bg: "#ffffff10",
        },
        ":active": {
            bg: "#ffffff10",
        },
    },
} as const;

export const COMMON_FRAME_SOLID_TOUCH_COLOR = {
    ":hover": {
        bg: "#ffffff40",
    },
    ":active": {
        bg: "#ffffff40",
    },
    _dark: {
        ":hover": {
            bg: "#ffffff40",
        },
        ":active": {
            bg: "#ffffff40",
        },
    },
} as const;

export const COMMON_FRAME_BUTTON_STYLE = {
    ...COMMON_TOUCH_COLOR,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
} as const;

export const COMMON_FRAME_SOLID_BUTTON_STYLE = {
    ...COMMON_FRAME_SOLID_TOUCH_COLOR,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
} as const;
