import { createStyle } from "@gluestack-style/react";

// Bilisound custom
export const ActionsheetBackdrop = createStyle({
    ":initial": {
        opacity: 0,
    },
    ":animate": {
        opacity: 0.6,
    },
    ":exit": {
        opacity: 0,
    },
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    bg: "black",
    // @ts-ignore
    _dark: {
        bg: "black",
    },
    // @ts-ignore
    _web: {
        cursor: "default",
    },
});
