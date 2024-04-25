import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

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

const YuruChara: React.FC = () => (
    <View style={styles.image} pointerEvents="none">
        <Image source={require("../assets/images/bg-corner.svg")} style={styles.imageInner} />
    </View>
);

export default YuruChara;
