import { Image as ExpoImage } from "expo-image";
import { cssInterop } from "nativewind";
import React from "react";
import { View } from "react-native";

import useSettingsStore from "~/store/settings";

const Image = cssInterop(ExpoImage, {
    className: {
        target: "style",
    },
});

export default function YuruChara() {
    const { theme } = useSettingsStore(state => ({ theme: state.theme }));

    let source;

    switch (theme) {
        case "red": {
            source = require("../assets/images/bg-corner-red.webp");
            break;
        }
        case "classic":
        default: {
            source = require("../assets/images/bg-corner-classic.svg");
            break;
        }
    }

    return (
        <View className="w-[240px] aspect-square absolute right-0 bottom-[100px] z-10" pointerEvents="none">
            <Image source={source} className="w-[240px] aspect-square opacity-20" />
        </View>
    );
}
