import { Box, Text } from "@gluestack-ui/themed";
import { router } from "expo-router";
import React from "react";
import { Platform } from "react-native";
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
            <Box w="100%" h="100%">
                <AudioPlayerModal />
            </Box>
        );
    }

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={flingGesture}>
                <Box w="100%" h="100%">
                    <AudioPlayerModal />
                </Box>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};
export default ModalScreen;
