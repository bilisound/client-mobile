import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, Platform, StatusBar, useColorScheme, View, Text } from "react-native";
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
import { createStyleSheet, useStyles } from "react-native-unistyles";

import SongItem from "./SongItem";

import Pressable from "~/components/ui/Pressable";
import useTracks from "~/hooks/useTracks";
import useSettingsStore from "~/store/settings";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { getFileName } from "~/utils/format";
import { formatSecond, saveFile } from "~/utils/misc";
import { handlePrev, handleTogglePlay } from "~/utils/player-control";
import { tracksToPlaylist } from "~/utils/track-data";

function AudioProgressBar() {
    const colorScheme = useColorScheme();
    const { theme, styles } = useStyles(styleSheet);

    const [value, setValue] = useState(0);
    const [holding, setHolding] = useState(false);

    // 进度提示
    const [glowTotalWidth, setGlowTotalWidth] = useState(0);
    const glowWidth = glowTotalWidth * 1.2;
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
            <View onLayout={e => setGlowTotalWidth(e.nativeEvent.layout.width - 20)} style={styles.barLoadingContainer}>
                <View style={styles.barLoading}>
                    <Animated.View style={[{ width: glowWidth, height: 3 }, animatedStyle]}>
                        <LinearGradient
                            colors={
                                colorScheme === "dark"
                                    ? [theme.colors.primary[900], theme.colors.primary[700], theme.colors.primary[900]]
                                    : [theme.colors.primary[200], theme.colors.primary[400], theme.colors.primary[200]]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.barLoadingGradient}
                        />
                    </Animated.View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.barContainer}>
            <View style={styles.bar}>
                <View style={[styles.barBuffered, { width: `${(buffered / duration) * 100}%` }]} />
                <View style={[styles.barPlayed, { width: `${(value / duration) * 100}%` }]} />
            </View>
            <View style={styles.barSliderOuter}>
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
                    containerStyle={styles.barSliderContainer}
                    trackStyle={styles.barSliderTrack}
                    minimumTrackStyle={styles.barSliderMinimumTrack}
                    thumbStyle={styles.barSliderThumb}
                    thumbTouchSize={{ width: 16, height: 16 }}
                />
            </View>
        </View>
    );
}

function AudioProgressTimer() {
    const { position, duration } = useProgress();
    const activeTrack = useActiveTrack();
    const { styles } = useStyles(styleSheet);

    return (
        <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{activeTrack?.bilisoundIsLoaded ? formatSecond(position) : "00:00"}</Text>
            <Text style={styles.timerText}>{activeTrack?.bilisoundIsLoaded ? formatSecond(duration) : "00:00"}</Text>
        </View>
    );
}

function AudioPlayButtonIcon() {
    const playbackState = usePlaybackState();
    const { theme } = useStyles();

    return playbackState.state === State.Playing ? (
        <FontAwesome5 name="pause" size={28} color={theme.colorTokens.buttonForeground("primary", "default")} />
    ) : (
        <FontAwesome5 name="play" size={28} color={theme.colorTokens.buttonForeground("primary", "default")} />
    );
}

function MusicPicture({ image, bilisoundId }: { image?: string; bilisoundId?: string }) {
    const colorScheme = useColorScheme();
    const [smallestSize, setSmallestSize] = useState(0);
    const { styles } = useStyles(styleSheet);

    return (
        <View
            style={styles.musicPictureContainer}
            onLayout={e => {
                const layout = e.nativeEvent.layout;
                setSmallestSize(Math.min(layout.width, layout.height) - 64);
            }}
        >
            {colorScheme === "dark" ? (
                <Image
                    source={getImageProxyUrl(image ?? "", bilisoundId ?? "")}
                    style={[styles.musicImage, { width: smallestSize }]}
                    contentFit="cover"
                />
            ) : (
                <ShadowedView style={styles.shadowedView}>
                    <Image
                        source={getImageProxyUrl(image ?? "", bilisoundId ?? "")}
                        style={[styles.musicImage, { width: smallestSize }]}
                        contentFit="cover"
                    />
                </ShadowedView>
            )}
        </View>
    );
}

function MusicList() {
    const { tracks } = useTracks();
    const { styles } = useStyles(styleSheet);

    // 转换后的列表
    const convertedTrack = useMemo(() => tracksToPlaylist(tracks), [tracks]);

    return (
        <View style={styles.musicListContainer}>
            <View style={styles.musicListHeader}>
                <Text style={styles.musicListHeaderText}>{`当前队列 (${tracks.length})`}</Text>
            </View>
            <View style={styles.musicListContent}>
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
            </View>
        </View>
    );
}

export default function AudioPlayerModal() {
    const { styles, theme } = useStyles(styleSheet);
    const colorScheme = useColorScheme();
    const textBasicColor = theme.colorTokens.foreground;
    const activeTrack = useActiveTrack();
    const safeAreaInsets = useSafeAreaInsets();
    const [showList, setShowList] = useState(false);
    const { useLegacyID } = useSettingsStore(state => ({
        useLegacyID: state.useLegacyID,
    }));

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: safeAreaInsets.top,
                    paddingBottom: safeAreaInsets.bottom,
                    paddingLeft: safeAreaInsets.left,
                    paddingRight: safeAreaInsets.right,
                },
            ]}
        >
            {Platform.OS === "ios" ? null : (
                <StatusBar
                    barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                    showHideTransition="none"
                />
            )}
            <View style={styles.handleContainer} aria-hidden>
                <View style={styles.handle} />
            </View>
            {showList ? (
                <MusicList />
            ) : (
                <MusicPicture image={activeTrack?.artwork} bilisoundId={activeTrack?.bilisoundId} />
            )}
            <View style={styles.controlsContainer}>
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
                    <View style={styles.trackInfoContainer}>
                        <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">
                            {activeTrack?.title}
                        </Text>
                        <Text style={styles.trackArtist} numberOfLines={1} ellipsizeMode="tail">
                            {activeTrack?.artist}
                        </Text>
                    </View>
                </Pressable>
                <View style={styles.progressBarWrapper}>
                    <AudioProgressBar />
                </View>
                <AudioProgressTimer />
                <View style={styles.controlButtonsContainer}>
                    {/* 歌单 */}
                    <Pressable
                        style={styles.controlButtonSmall}
                        outerStyle={styles.controlButtonOuter}
                        onPress={() => {
                            setShowList(prevState => !prevState);
                        }}
                    >
                        <MaterialIcons
                            name="playlist-play"
                            size={32}
                            color={textBasicColor}
                            style={{
                                transform: [{ translateX: 2 }],
                            }}
                        />
                    </Pressable>

                    <View style={styles.controlButtonsGroup}>
                        {/* 上一首 */}
                        <Pressable
                            style={styles.controlButton}
                            outerStyle={styles.controlButtonOuter}
                            onPress={async () => {
                                await handlePrev();
                            }}
                        >
                            <FontAwesome5
                                name="step-backward"
                                size={24}
                                color={textBasicColor}
                                style={styles.controlButtonIcon}
                            />
                        </Pressable>

                        {/* 播放/暂停 */}
                        <Pressable
                            style={styles.controlButtonPlay}
                            outerStyle={styles.controlButtonOuter}
                            pressedBackgroundColor={theme.colorTokens.buttonBackground("primary", "active")}
                            onPress={async () => {
                                await handleTogglePlay();
                            }}
                        >
                            <AudioPlayButtonIcon />
                        </Pressable>

                        {/* 下一首 */}
                        <Pressable
                            style={styles.controlButton}
                            outerStyle={styles.controlButtonOuter}
                            onPress={async () => {
                                await TrackPlayer.skipToNext();
                            }}
                        >
                            <FontAwesome5
                                name="step-forward"
                                size={24}
                                color={textBasicColor}
                                style={styles.controlButtonIcon}
                            />
                        </Pressable>
                    </View>

                    {/* 导出 */}
                    <Pressable
                        style={styles.controlButtonSmall}
                        outerStyle={styles.controlButtonOuter}
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
                        <Ionicons name="save" size={20} color={textBasicColor} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        backgroundColor: theme.colorTokens.background,
    },
    handleContainer: {
        alignItems: "center",
        padding: 8,
    },
    handle: {
        width: 48,
        height: 4,
        backgroundColor: theme.colorTokens.buttonBackground("primary", "default"),
        borderRadius: 2,
    },
    // AudioProgressBar
    barLoadingContainer: {
        height: 16,
        justifyContent: "center",
        flex: 1,
        position: "relative",
        paddingLeft: 10,
        paddingRight: 10,
    },
    barLoading: {
        height: 3,
        borderRadius: 9999,
        backgroundColor: theme.colorScheme === "light" ? theme.colors.neutral[200] : theme.colors.primary[900],
        overflow: "hidden",
    },
    barLoadingGradient: {
        width: "100%",
        height: "100%",
    },
    barContainer: {
        height: 16,
        justifyContent: "center",
        flex: 1,
        position: "relative",
    },
    bar: {
        left: 10,
        right: 10,
        top: 6.5,
        height: 3,
        borderRadius: 2,
        backgroundColor: theme.colorScheme === "light" ? theme.colors.neutral[200] : theme.colors.primary[900],
        position: "absolute",
        overflow: "hidden",
    },
    barBuffered: {
        height: "100%",
        backgroundColor: theme.colorScheme === "light" ? theme.colors.neutral[200] : theme.colors.primary[900],
        position: "absolute",
    },
    barPlayed: {
        height: "100%",
        backgroundColor: theme.colors.primary[500],
        position: "absolute",
    },
    barSliderOuter: {
        position: "absolute",
        paddingHorizontal: 8,
        width: "100%",
    },
    barSliderContainer: {
        width: "100%",
    },
    barSliderTrack: {
        backgroundColor: "transparent",
    },
    barSliderMinimumTrack: {
        backgroundColor: "transparent",
    },
    barSliderThumb: {
        width: 16,
        height: 16,
        backgroundColor: theme.colors.primary[500],
    },
    // AudioProgressTimer
    timerContainer: {
        paddingHorizontal: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 8,
    },
    timerText: {
        fontSize: 14,
        opacity: 0.65,
        color: theme.colorTokens.foreground,
    },
    // MusicPicture
    musicPictureContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    musicImage: {
        aspectRatio: 1,
        borderRadius: 16,
    },
    shadowedView: {
        shadowOpacity: 0.2,
        shadowRadius: 24,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        borderRadius: 16,
        shadowColor: "#000000",
    },
    controlsContainer: {
        flex: 0,
        flexBasis: "auto",
        height: 256,
    },
    trackInfoContainer: {
        paddingHorizontal: 30,
        paddingVertical: 16,
        gap: 8,
    },
    trackTitle: {
        fontSize: 20,
        fontWeight: "800",
        lineHeight: 30,
        color: theme.colorTokens.foreground,
    },
    trackArtist: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.65,
        fontWeight: "400",
        color: theme.colorTokens.foreground,
    },
    progressBarWrapper: {
        flexDirection: "row",
        alignItems: "center",
        height: 16,
        paddingHorizontal: 20,
        marginTop: 8,
    },
    controlButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    controlButton: {
        width: 68,
        height: 68,
        alignItems: "center",
        justifyContent: "center",
    },
    controlButtonSmall: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    controlButtonPlay: {
        width: 68,
        height: 68,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colorTokens.buttonBackground("primary", "default"),
    },
    controlButtonOuter: {
        borderRadius: 999,
        overflow: "hidden",
    },
    controlButtonIcon: {
        transform: [{ scaleX: 1.4 }],
    },
    controlButtonsGroup: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    // MusicList
    musicListContainer: {
        flex: 1,
        marginBottom: 24,
    },
    musicListHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    musicListHeaderText: {
        fontWeight: "700",
        fontSize: 18,
        color: theme.colorTokens.foreground,
    },
    musicListContent: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colorTokens.border,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },
}));
