import { FontAwesome5 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { View, Pressable as NativePressable, Text } from "react-native";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import Pressable from "~/components/ui/Pressable";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { handleTogglePlay } from "~/utils/player-control";

export default function AudioIndicator() {
    const activeTrack = useActiveTrack();
    const playbackState = usePlaybackState();
    const { styles, theme } = useStyles(styleSheet);
    const primaryColor = theme.colors.primary[500];

    if (!activeTrack) {
        return null;
    }

    return (
        <View style={styles.container}>
            <NativePressable
                onPress={() => {
                    router.push("/modal");
                }}
                style={styles.pressableContainer}
            >
                <Image
                    source={getImageProxyUrl(activeTrack?.artwork ?? "", activeTrack?.bilisoundId ?? "")}
                    style={styles.image}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.text} ellipsizeMode="tail" numberOfLines={1}>
                        {activeTrack?.title}
                    </Text>
                </View>
            </NativePressable>
            <Pressable
                outerStyle={styles.playButtonOuter}
                style={styles.playButton}
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
        </View>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        borderWidth: 1,
        borderColor: theme.colorTokens.border,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    pressableContainer: {
        flexDirection: "row",
        flex: 1,
        gap: 12,
    },
    image: {
        height: 40,
        aspectRatio: 16 / 9,
        borderRadius: 6,
        flex: 0,
        flexBasis: "auto",
    },
    textContainer: {
        flex: 1,
        height: 40,
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        color: theme.colorTokens.foreground,
    },
    playButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        flex: 0,
        flexBasis: "auto",
    },
    playButtonOuter: {
        borderRadius: 6,
        overflow: "hidden",
    },
}));
