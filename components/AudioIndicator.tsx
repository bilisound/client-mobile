import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, Text, Box } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";

import { COMMON_TOUCH_COLOR } from "../constants/style";
import useCommonColors from "../hooks/useCommonColors";
import { handleTogglePlay } from "../utils/player-control";

const AudioIndicator: React.FC = () => {
    const activeTrack = useActiveTrack();
    const playbackState = usePlaybackState();
    const { primaryColor } = useCommonColors();

    if (!activeTrack) {
        return null;
    }

    return (
        <Box
            sx={{
                borderWidth: 1,
                borderColor: "$backgroundLight100",
                _dark: {
                    borderColor: "$backgroundDark900",
                },
                borderLeftWidth: 0,
                borderRightWidth: 0,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
            }}
        >
            <Pressable
                onPress={() => {
                    router.push("/modal");
                }}
                sx={{
                    flexDirection: "row",
                    flex: 1,
                    gap: 12,
                }}
            >
                <Image
                    source={activeTrack?.artwork}
                    style={{
                        height: 40,
                        aspectRatio: "16/9",
                        borderRadius: 6,
                        flex: 0,
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        height: 40,
                        justifyContent: "center",
                    }}
                >
                    <Text ellipsizeMode="tail" numberOfLines={1}>
                        {activeTrack?.title}
                    </Text>
                </View>
            </Pressable>
            <Pressable
                sx={{
                    width: 40,
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    flex: 0,
                    ...COMMON_TOUCH_COLOR,
                }}
                onPressOut={async () => {
                    await handleTogglePlay();
                }}
            >
                <FontAwesome5
                    name={playbackState.state === State.Playing ? "pause" : "play"}
                    size={16}
                    color={primaryColor}
                />
            </Pressable>
        </Box>
    );
};

export default AudioIndicator;
