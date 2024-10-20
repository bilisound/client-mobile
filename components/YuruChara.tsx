import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

import useSettingsStore from "~/store/settings";

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
        <View className="w-[240px] aspect-square absolute right-0 bottom-[100px] z-10 pointer-events-none">
            <Image source={source} className="w-[240px] aspect-square opacity-20" />
        </View>
    );
}
