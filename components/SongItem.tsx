import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { Box, Center, Pressable, Text } from "@gluestack-ui/themed";
import React from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";

import ProgressBar from "./ProgressBar";
import { COMMON_TOUCH_COLOR, SCREEN_BREAKPOINTS } from "../constants/style";
import useCommonColors from "../hooks/useCommonColors";
import { PlaylistDetailRow } from "../storage/playlist";
import { formatSecond } from "../utils/misc";
import { handleTogglePlay } from "../utils/player-control";

// 播放状态图标
function PlayingIcon() {
    const playingState = usePlaybackState().state;
    const activeTrack = useActiveTrack();
    const isPlaying = playingState === State.Playing;
    const { accentColor } = useCommonColors();

    if (!activeTrack?.bilisoundIsLoaded) {
        return <ActivityIndicator color={accentColor} />;
    }

    return <FontAwesome5 name={isPlaying ? "pause" : "play"} size={20} color={accentColor} />;
}

export interface SongItemProps {
    onRequestPlay?: () => void;
    onLongPress?: () => void;
    data: PlaylistDetailRow;
    index?: number;
    isChecking?: boolean;
    isChecked?: boolean;
}

export default function SongItem({
    onRequestPlay = () => {},
    onLongPress = () => {},
    data,
    index,
    isChecking,
    isChecked,
}: SongItemProps) {
    const activeTrack = useActiveTrack();
    const isActiveTrack = data.bvid === activeTrack?.bilisoundId && data.episode === activeTrack?.bilisoundEpisode;
    const { width } = useWindowDimensions();
    const { textBasicColor } = useCommonColors();

    return (
        <Pressable
            sx={COMMON_TOUCH_COLOR}
            onPress={async () => {
                if (isActiveTrack) {
                    await handleTogglePlay();
                    return;
                }
                onRequestPlay();
            }}
            onLongPress={onLongPress}
        >
            <Box
                sx={{
                    paddingHorizontal: width >= SCREEN_BREAKPOINTS.md ? 24 : 16,
                    height: 64,
                    flexDirection: "row",
                    gap: 12,
                    position: "relative",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        flexDirection: "row",
                        flex: 1,
                        gap: 12,
                        justifyContent: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: isActiveTrack ? "$accent500" : "$primary500",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 6,
                            paddingRight: 6,
                            height: 22,
                            borderRadius: 6,
                            flex: 0,
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "$white",
                            }}
                        >
                            {typeof index === "number" ? index : data.episode}
                        </Text>
                    </Box>
                    <Box flex={1}>
                        <Text
                            sx={{
                                lineHeight: 22,
                                fontSize: 14,
                                fontWeight: isActiveTrack ? "700" : "400",
                                color: isActiveTrack ? "$accent500" : textBasicColor,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {data.title}
                        </Text>
                        <Box
                            sx={{
                                marginTop: 4,
                                gap: 4,
                                flexDirection: "row",
                                alignItems: "center",
                                opacity: 0.5,
                            }}
                        >
                            <Text
                                sx={{
                                    fontSize: 14,
                                }}
                            >
                                {formatSecond(data.duration)}
                            </Text>
                        </Box>
                    </Box>
                </Box>
                {isChecking && (
                    <Box flex={0}>
                        <Center
                            w="$7"
                            h="$7"
                            rounded="$full"
                            borderWidth={2}
                            bg={isChecked ? "$primary500" : "transparent"}
                            borderColor="$primary500"
                        >
                            <Entypo name="check" size={18} color="white" />
                        </Center>
                    </Box>
                )}
                {isActiveTrack ? (
                    <>
                        <Box
                            sx={{
                                flex: 0,
                                alignItems: "center",
                                justifyContent: "center",
                                width: 32,
                            }}
                        >
                            <PlayingIcon />
                        </Box>
                        <ProgressBar item={`${data.bvid}_${data.episode}`} />
                    </>
                ) : null}
            </Box>
        </Pressable>
    );
}
