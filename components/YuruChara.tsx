import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

import useSettingsStore from "~/store/settings";

const styles = StyleSheet.create({
    image: {
        width: 240,
        aspectRatio: "1/1",
        position: "absolute",
        right: 0,
        bottom: 100,
        zIndex: 1,
    },
    imageInner: {
        width: 240,
        aspectRatio: "1/1",
        opacity: 0.25,
    },
});

const YuruChara: React.FC = () => {
    const { theme } = useSettingsStore(state => ({ theme: state.theme }));

    return (
        <View style={styles.image} pointerEvents="none">
            {theme === "classic" && (
                <Image source={require("../assets/images/bg-corner-classic.svg")} style={styles.imageInner} />
            )}
            {theme === "red" && (
                <Image source={require("../assets/images/bg-corner-red.webp")} style={styles.imageInner} />
            )}
        </View>
    );
};

export default YuruChara;
