import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop, remapProps } from "nativewind";

import LogViewer from "~/components/dom/LogViewer";
import { Monicon } from "@monicon/native";

cssInterop(FontAwesome5, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(FontAwesome6, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(Ionicons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(Image, {
    className: {
        target: "style",
    },
});
remapProps(LinearGradient, {
    className: "style",
});
cssInterop(LogViewer, { className: "style" });
cssInterop(Monicon, {
    className: {
        // @ts-ignore
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
