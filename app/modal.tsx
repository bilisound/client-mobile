import { router } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

import AudioPlayerModal from "~/components/AudioPlayerModal";

const ModalScreen: React.FC = () => {
    const flingGesture = Gesture.Fling()
        .direction(Directions.DOWN)
        .onStart(() => {
            router.back();
        })
        .runOnJS(true);

    if (Platform.OS === "ios") {
        return <AudioPlayerModal />;
    }

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={flingGesture}>
                <AudioPlayerModal />
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

export default ModalScreen;
