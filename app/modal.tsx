import React from "react";
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler";
import { Box, Text } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { Platform } from "react-native";
import AudioPlayerModal from "../components/AudioPlayerModal";

const ModalScreen: React.FC = () => {
    const flingGesture = Gesture.Fling()
        .direction(Directions.DOWN)
        .onStart((e) => {
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
        <GestureDetector gesture={flingGesture}>
            <Box w="100%" h="100%">
                <AudioPlayerModal />
            </Box>
        </GestureDetector>
    );
};
export default ModalScreen;
