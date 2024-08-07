import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, Box } from "@gluestack-ui/themed";
import { Slider } from "@miblanchard/react-native-slider";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, Platform, StatusBar, useColorScheme, View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";
import Animated, {
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, { State, useActiveTrack, usePlaybackState, useProgress } from "react-native-track-player";

import SongItem from "./SongItem";

import { COMMON_TOUCH_COLOR } from "~/constants/style";
import useCommonColors from "~/hooks/useCommonColors";
import useTracks from "~/hooks/useTracks";
import useSettingsStore from "~/store/settings";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { getFileName } from "~/utils/format";
import { formatSecond, saveFile } from "~/utils/misc";
import { handlePrev, handleTogglePlay } from "~/utils/player-control";
import { tracksToPlaylist } from "~/utils/track-data";

function AudioProgressBar() {
    const { primaryColor } = useCommonColors();
    const colorScheme = useColorScheme();

    const [value, setValue] = useState(0);
    const [holding, setHolding] = useState(false);

    // 进度提示
    const [glowTotalWidth, setGlowTotalWidth] = useState(0);
    const glowWidth = glowTotalWidth * 0.618;
    const glowPosition = useSharedValue<number>(0);

    useEffect(() => {
        glowPosition.value = withRepeat(
            withTiming(glowTotalWidth + glowWidth, { duration: 1000 }),
            -1,
            false,
            () => {},
            ReduceMotion.System,
        );
    }, [glowPosition, glowTotalWidth, glowWidth]);

    // 播放状态
    const activeTrack = useActiveTrack();
    const { position, buffered, duration } = useProgress();

    useEffect(() => {
        if (!holding) {
            setValue(position);
        }
    }, [holding, position]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: glowPosition.value - glowWidth }],
    }));

    if (!activeTrack?.bilisoundIsLoaded) {
        return (
            <View
                onLayout={e => setGlowTotalWidth(e.nativeEvent.layout.width - 20)}
                style={{
                    height: 16,
                    justifyContent: "center",
                    flex: 1,
                    position: "relative",
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                <Box
                    sx={{
                        height: 3,
                        borderRadius: 9999,
                        backgroundColor: "$trueGray200",
                        _dark: {
                            backgroundColor: "$primary900",
                        },
                        overflow: "hidden",
                    }}
                >
                    <Animated.View style={[{ width: glowWidth, height: 3 }, animatedStyle]}>
                        <LinearGradient
                            colors={
                                colorScheme === "dark"
                                    ? ["#0c554d", "#028373", "#0c554d"]
                                    : ["#e5e5e5", "#a3a3a3", "#e5e5e5"]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </Animated.View>
                </Box>
            </View>
        );
    }

    return (
        <Box
            sx={{
                height: 16,
                justifyContent: "center",
                flex: 1,
                position: "relative",
            }}
        >
            <Box
                sx={{
                    left: 10,
                    right: 10,
                    top: 6.5,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "$trueGray200",
                    _dark: {
                        backgroundColor: "$primary900",
                    },
                    position: "absolute",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        backgroundColor: "$trueGray200",
                        _dark: {
                            backgroundColor: "$primary900",
                        },
                        position: "absolute",
                        width: `${(buffered / duration) * 100}%`,
                    }}
                />
                <Box
                    sx={{
                        height: "100%",
                        backgroundColor: "$primary500",
                        position: "absolute",
                        width: `${(value / duration) * 100}%`,
                    }}
                />
            </Box>
            <Box position="absolute" px={8} w="100%">
                <Slider
                    value={value}
                    onValueChange={([v]) => setValue(v)}
                    onSlidingStart={() => {
                        setValue(position);
                        setHolding(true);
                    }}
                    onSlidingComplete={async val => {
                        await TrackPlayer.seekTo(val[0]);
                        setHolding(false);
                    }}
                    minimumValue={0}
                    maximumValue={duration}
                    containerStyle={{
                        width: "100%",
                    }}
                    trackStyle={{
                        backgroundColor: "transparent",
                    }}
                    minimumTrackStyle={{
                        backgroundColor: "transparent",
                    }}
                    thumbStyle={{
                        width: 16,
                        height: 16,
                        backgroundColor: primaryColor,
                    }}
                    thumbTouchSize={{ width: 16, height: 16 }}
                />
            </Box>
        </Box>
    );
}

function AudioProgressTimer() {
    const { position, duration } = useProgress();
    const activeTrack = useActiveTrack();

    return (
        <Box
            sx={{
                paddingHorizontal: 30,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 8,
            }}
        >
            <Text
                sx={{
                    fontSize: 14,
                    opacity: 0.65,
                }}
            >
                {activeTrack?.bilisoundIsLoaded ? formatSecond(position) : "00:00"}
            </Text>
            <Text
                sx={{
                    fontSize: 14,
                    opacity: 0.65,
                }}
            >
                {activeTrack?.bilisoundIsLoaded ? formatSecond(duration) : "00:00"}
            </Text>
        </Box>
    );
}

function AudioPlayButtonIcon() {
    const playbackState = usePlaybackState();

    return playbackState.state === State.Playing ? (
        <FontAwesome5 name="pause" size={28} color="#fff" />
    ) : (
        <FontAwesome5 name="play" size={28} color="#fff" />
    );
}

function MusicPicture({ image, bilisoundId }: { image?: string; bilisoundId?: string }) {
    const colorScheme = useColorScheme();
    const [smallestSize, setSmallestSize] = useState(0);

    return (
        <Box
            sx={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
            }}
            onLayout={e => {
                const layout = e.nativeEvent.layout;
                setSmallestSize(Math.min(layout.width, layout.height) - 64);
            }}
        >
            {colorScheme === "dark" ? (
                <Image
                    source={getImageProxyUrl(image ?? "", bilisoundId ?? "")}
                    style={{
                        aspectRatio: "1/1",
                        borderRadius: 16,
                        width: smallestSize,
                    }}
                    contentFit="cover"
                />
            ) : (
                <ShadowedView
                    style={{
                        shadowOpacity: 0.2,
                        shadowRadius: 24,
                        shadowOffset: {
                            width: 4,
                            height: 4,
                        },
                        borderRadius: 16,
                    }}
                >
                    <Image
                        source={getImageProxyUrl(image ?? "", bilisoundId ?? "")}
                        style={{
                            aspectRatio: "1/1",
                            borderRadius: 16,
                            width: smallestSize,
                        }}
                        contentFit="cover"
                    />
                </ShadowedView>
            )}
        </Box>
    );
}

function MusicList() {
    const { tracks } = useTracks();
    // const { primaryColor } = useCommonColors();

    // 转换后的列表
    const convertedTrack = useMemo(() => tracksToPlaylist(tracks), [tracks]);

    return (
        <Box
            sx={{
                flex: 1,
                mb: "$6",
            }}
        >
            <Box
                flex={0}
                flexBasis="auto"
                pl="$4"
                pr="$3"
                py="$3"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Text fontWeight="700" fontSize="$lg">{`当前队列 (${tracks.length})`}</Text>
                {/*<Pressable
                    sx={COMMON_FRAME_BUTTON_STYLE}
                    onPress={() => {
                        Alert.alert("警告！！", "本功能正在开发中。如果看到本消息，请暴打开发者！");
                    }}
                >
                    <FontAwesome5 name="random" size={20} color={primaryColor} />
                </Pressable>*/}
            </Box>
            <Box
                sx={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "$backgroundLight100",
                    _dark: {
                        borderColor: "$backgroundDark900",
                    },
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                }}
            >
                <FlashList
                    renderItem={item => {
                        return (
                            <SongItem
                                data={item.item}
                                index={item.index + 1}
                                onRequestPlay={async () => {
                                    await TrackPlayer.skip(item.index);
                                    await TrackPlayer.play();
                                }}
                            />
                        );
                    }}
                    data={convertedTrack}
                    estimatedItemSize={64}
                    extraData={[]}
                />
            </Box>
        </Box>
    );
}

export default function AudioPlayerModal() {
    const colorScheme = useColorScheme();
    const { textBasicColor } = useCommonColors();
    const activeTrack = useActiveTrack();
    const safeAreaInsets = useSafeAreaInsets();
    const [showList, setShowList] = useState(false);
    const { useLegacyID } = useSettingsStore(state => ({
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
            {showList ? (
                <MusicList />
            ) : (
                <MusicPicture image={activeTrack?.artwork} bilisoundId={activeTrack?.bilisoundId} />
            )}
            <Box
                sx={{
                    flex: 0,
                    flexBasis: "auto",
                    height: 240,
                }}
            >
                <Pressable
                    onPress={() => {
                        if (Platform.OS === "ios") {
                            router.back();
                            router.push(`/query/${activeTrack?.bilisoundId}`);
                            return;
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
                <AudioProgressTimer />
                <Box
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 20,
                        paddingHorizontal: 20,
                    }}
                >
                    {/* 歌单 */}
                    <Pressable
                        sx={{
                            ...COMMON_TOUCH_COLOR,
                            width: 40,
                            height: 40,
                            borderRadius: 999,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={() => {
                            setShowList(prevState => !prevState);
                        }}
                    >
                        <MaterialIcons
                            name="playlist-play"
                            size={34}
                            color={textBasicColor}
                            style={{
                                transform: [{ translateX: 2 }],
                            }}
                        />
                    </Pressable>

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
                            <AudioPlayButtonIcon />
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
                            if (Platform.OS === "web") {
                                await Linking.openURL(
                                    `${activeTrack?.url}&dl=${useSettingsStore.getState().useLegacyID ? "av" : "bv"}`,
                                );
                                return;
                            }
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
}
