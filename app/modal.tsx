import { router } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

import AudioPlayerModal from "~/components/AudioPlayerModal";

const ModalScreen: React.FC = () => {
    const flingGesture = Gesture.Fling()
        .direction(Directions.DOWN)
        .onStart(e => {
            if (Platform.OS === "ios") {
                return;
            }
            router.back();
        })
        .runOnJS(true);

    if (Platform.OS === "ios") {
        return (
            <View style={styles.container}>
                <AudioPlayerModal />
            </View>
        );
    }

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={flingGesture}>
                <View style={styles.container}>
                    <AudioPlayerModal />
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
});

export default ModalScreen;
