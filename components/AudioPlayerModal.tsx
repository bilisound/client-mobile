import { Platform, StatusBar, useColorScheme } from "react-native";
import React, { useState } from "react";
import TrackPlayer, { State, useActiveTrack, usePlaybackState, useProgress } from "react-native-track-player";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Pressable, Text, Box } from "@gluestack-ui/themed";
import AudioProgressBar from "./AudioProgressBar";
import { formatSecond, saveFile } from "../utils/misc";
import { handlePrev, handleTogglePlay } from "../utils/player-control";
import useSettingsStore from "../store/settings";
import { getFileName } from "../utils/format";
import { COMMON_TOUCH_COLOR } from "../constants/style";
import useCommonColors from "../hooks/useCommonColors";

const AudioPlayerModal: React.FC = () => {
    const colorScheme = useColorScheme();
    const { textBasicColor } = useCommonColors();
    const activeTrack = useActiveTrack();
    const playbackState = usePlaybackState();
    const safeAreaInsets = useSafeAreaInsets();
    const { position, duration } = useProgress();
    const [smallestSize, setSmallestSize] = useState(0);
    const { useLegacyID } = useSettingsStore((state) => ({
        useLegacyID: state.useLegacyID,
    }));

    return (
        <Box
            sx={{
                height: "100%",
                paddingTop: safeAreaInsets.top,
                paddingBottom: safeAreaInsets.bottom,
                paddingLeft: safeAreaInsets.left,
                paddingRight: safeAreaInsets.right,
                _ios: {
                    paddingTop: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                },
                /* backgroundColor: "$primary100",
            _dark: {
                backgroundColor: "$primary950",
            }, */
                backgroundColor: "$backgroundLight",
                _dark: {
                    backgroundColor: "$backgroundDark",
                },
            }}
        >
            {Platform.OS === "ios" ? null : (
                <StatusBar
                    barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                    showHideTransition="none"
                />
            )}
            <Box
                sx={{
                    alignItems: "center",
                    // backgroundColor: "yellow",
                    padding: "$2",
                }}
                aria-hidden
            >
                <Box
                    sx={{
                        width: "$12",
                        height: "$1",
                        backgroundColor: "$primary500",
                        borderRadius: 9999,
                    }}
                />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onLayout={(e) => {
                    const layout = e.nativeEvent.layout;
                    setSmallestSize(Math.min(layout.width, layout.height) - 64);
                }}
            >
                <Image
                    source={activeTrack?.artwork}
                    style={{
                        aspectRatio: "1/1",
                        borderRadius: 16,
                        width: smallestSize,
                    }}
                    contentFit="cover"
                />
            </Box>
            <Box
                sx={{
                    flex: 0,
                    height: 240,
                }}
            >
                <Pressable
                    onPress={() => {
                        if (Platform.OS === "ios") {
                            router.back();
                            router.push(`/query/${activeTrack?.bilisoundId}`);
                        }
                        router.replace(`/query/${activeTrack?.bilisoundId}`);
                    }}
                >
                    <Box
                        sx={{
                            paddingHorizontal: 30,
                            height: 80,
                            gap: 8,
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: 20,
                                fontWeight: "800",
                                lineHeight: 30,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {activeTrack?.title}
                        </Text>
                        <Text
                            sx={{
                                fontSize: 16,
                                lineHeight: 24,
                                opacity: 0.65,
                                fontWeight: "400",
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {activeTrack?.artist}
                        </Text>
                    </Box>
                </Pressable>
                <Box
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: 16,
                        paddingHorizontal: 20,
                    }}
                >
                    <AudioProgressBar />
                </Box>
                <Box
                    sx={{
                        paddingHorizontal: 30,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 12,
                    }}
                >
                    <Text
                        sx={{
                            fontSize: 14,
                            opacity: 0.65,
                        }}
                    >
                        {formatSecond(position)}
                    </Text>
                    <Text
                        sx={{
                            fontSize: 14,
                            opacity: 0.65,
                        }}
                    >
                        {formatSecond(duration)}
                    </Text>
                </Box>
                <Box
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 20,
                        paddingHorizontal: 18,
                    }}
                >
                    {/* 预留位置 */}
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 999,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    />
                    <Box
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                        }}
                    >
                        {/* 上一首 */}
                        <Pressable
                            sx={{
                                ...COMMON_TOUCH_COLOR,
                                width: 68,
                                height: 68,
                                borderRadius: 999,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={async () => {
                                await handlePrev();
                            }}
                        >
                            <FontAwesome5
                                name="step-backward"
                                size={24}
                                color={textBasicColor}
                                style={{
                                    transform: [{ scaleX: 1.4 }],
                                }}
                            />
                        </Pressable>

                        {/* 播放/暂停 */}
                        <Pressable
                            sx={{
                                width: 72,
                                height: 72,
                                borderRadius: 999,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "$primary500",
                                ":active": {
                                    backgroundColor: "$primary400",
                                },
                            }}
                            onPressOut={async () => {
                                await handleTogglePlay();
                            }}
                        >
                            {playbackState.state === State.Playing ? (
                                <FontAwesome5 name="pause" size={28} color="#fff" />
                            ) : (
                                <FontAwesome5 name="play" size={28} color="#fff" />
                            )}
                        </Pressable>

                        {/* 下一首 */}
                        <Pressable
                            sx={{
                                ...COMMON_TOUCH_COLOR,
                                width: 68,
                                height: 68,
                                borderRadius: 999,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={async () => {
                                await TrackPlayer.skipToNext();
                            }}
                        >
                            <FontAwesome5
                                name="step-forward"
                                size={24}
                                color={textBasicColor}
                                style={{
                                    transform: [{ scaleX: 1.4 }],
                                }}
                            />
                        </Pressable>
                    </Box>

                    {/* 导出 */}
                    <Pressable
                        sx={{
                            ...COMMON_TOUCH_COLOR,
                            width: 40,
                            height: 40,
                            borderRadius: 999,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={async () => {
                            await saveFile(
                                activeTrack?.url ?? "",
                                getFileName({
                                    av: useLegacyID,
                                    episode: activeTrack?.bilisoundEpisode ?? "",
                                    id: activeTrack?.bilisoundId ?? "",
                                    title: activeTrack?.title ?? "",
                                }),
                            );
                        }}
                    >
                        <Ionicons name="save" size={22} color={textBasicColor} />
                    </Pressable>
                </Box>
            </Box>
        </Box>
    );
};

export default AudioPlayerModal;
