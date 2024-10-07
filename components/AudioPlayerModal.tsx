import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { Slider } from "@miblanchard/react-native-slider";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, Platform, StatusBar, useColorScheme, View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";
import { useMMKVString } from "react-native-mmkv";
import Animated, {
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import TrackPlayer, { State, useActiveTrack, usePlaybackState, useProgress } from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import SongItem from "./SongItem";

import CommonLayout from "~/components/CommonLayout";
import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Box } from "~/components/ui/box";
import { Pressable } from "~/components/ui/pressable";
import { Text } from "~/components/ui/text";
import useTracks from "~/hooks/useTracks";
import { QUEUE_PLAYING_MODE, queueStorage } from "~/storage/queue";
import useSettingsStore from "~/store/settings";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { formatSecond } from "~/utils/datetime";
import { saveFile } from "~/utils/file";
import { getFileName } from "~/utils/format";
import { handlePrev, handleTogglePlay } from "~/utils/player-control";
import { setMode, tracksToPlaylist } from "~/utils/track-data";

const IconDown = createIcon(Entypo, "chevron-down");

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
            <Text style={[styles.timerText, { textAlign: "left" }]}>
                {activeTrack?.bilisoundIsLoaded ? formatSecond(position) : "00:00"}
            </Text>
            <Text style={[styles.timerText, { textAlign: "right" }]}>
                {activeTrack?.bilisoundIsLoaded ? formatSecond(duration) : "00:00"}
            </Text>
        </View>
    );
}

function AudioPlayButtonIcon() {
    const playbackState = usePlaybackState();
    const { theme } = useStyles();

    return playbackState.state === State.Playing ? (
        <FontAwesome5 name="pause" size={28} color={theme.colorTokens.buttonForeground("primary", "default")} />
    ) : (
        <FontAwesome5
            name="play"
            size={28}
            color={theme.colorTokens.buttonForeground("primary", "default")}
            style={{
                transform: [{ translateX: 3 }],
            }}
        />
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

    // 转换后的列表
    const convertedTrack = useMemo(() => tracksToPlaylist(tracks), [tracks]);

    return (
        <Box className="flex-1 mb-6 md:mb-0">
            <View className="flex-1 border border-l-0 border-r-0 border-outline-50 md:border-0">
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
                    ListHeaderComponent={<Box className="h-2" />}
                    ListFooterComponent={<Box className="h-2" />}
                    data={convertedTrack}
                    estimatedItemSize={64}
                    extraData={[]}
                />
            </View>
        </Box>
    );
}

interface TopTabButtonProps {
    active: boolean;
    children: string;
    onPress: () => void;
}

function TopTabButton({ active, children, onPress }: TopTabButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={
                "h-full items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" +
                (active ? " bg-background-0 shadow-sm" : "")
            }
        >
            <Text
                className={
                    "text-sm font-medium " + (active ? "font-semibold text-typography-700" : "text-typography-500")
                }
            >
                {children}
            </Text>
        </Pressable>
    );
}

export default function AudioPlayerModal() {
    const { styles, theme } = useStyles(styleSheet);
    const colorScheme = useColorScheme();
    const textBasicColor = theme.colorTokens.foreground;
    const activeTrack = useActiveTrack();
    const [showList, setShowList] = useState(false);
    const { useLegacyID } = useSettingsStore(state => ({
        useLegacyID: state.useLegacyID,
    }));
    const [queuePlayingMode] = useMMKVString(QUEUE_PLAYING_MODE, queueStorage);
    const { update } = useTracks();

    return (
        <View className="flex-1 bg-background-0">
            <CommonLayout
                overrideEdgeInsets={{
                    top: Platform.OS === "ios" ? 0 : undefined,
                }}
                titleBarClassName="h-[72px] px-[14px]"
                titleBarTheme="transparent"
                containerClassName="flex-col md:flex-row"
                title={
                    <Box className="h-10 items-center justify-center rounded-lg bg-background-100 p-1 gap-1 flex-row">
                        {/* key 是切换选项卡后阴影停滞问题的 workaround */}
                        <TopTabButton
                            key={`${showList}_正在播放`}
                            active={!showList}
                            onPress={() => setShowList(false)}
                        >
                            正在播放
                        </TopTabButton>
                        <TopTabButton key={`${showList}_播放队列`} active={showList} onPress={() => setShowList(true)}>
                            播放队列
                        </TopTabButton>
                    </Box>
                }
                leftAccessories={
                    <PotatoButtonTitleBar
                        label="返回"
                        Icon={IconDown}
                        theme="transparent"
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace("/");
                            }
                        }}
                    />
                }
            >
                <View className="flex-1">
                    {Platform.OS === "ios" ? null : (
                        <StatusBar
                            barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                            showHideTransition="none"
                        />
                    )}
                    {showList ? (
                        <MusicList />
                    ) : (
                        <MusicPicture image={activeTrack?.artwork} bilisoundId={activeTrack?.bilisoundId} />
                    )}
                </View>
                <View className="flex-0 md:flex-1 basis-auto h-64 md:h-full md:justify-center">
                    <PotatoPressable
                        onPress={() => {
                            if (Platform.OS === "ios") {
                                router.back();
                                router.push(`/query/${activeTrack?.bilisoundId}`);
                                return;
                            }
                            router.replace(`/query/${activeTrack?.bilisoundId}`);
                        }}
                    >
                        <View className="px-[30px] py-4 gap-2">
                            <Text
                                className="text-[20px] font-extrabold leading-normal"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {activeTrack?.title}
                            </Text>
                            <Text
                                className="text-base leading-normal opacity-65"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {activeTrack?.artist}
                            </Text>
                        </View>
                    </PotatoPressable>
                    <View className="flex-row items-center h-4 px-5 mt-2">
                        <AudioProgressBar />
                    </View>
                    <AudioProgressTimer />
                    <View style={styles.controlButtonsContainer}>
                        {/* 歌单 */}
                        <PotatoPressable
                            style={styles.controlButtonSmall}
                            outerStyle={styles.controlButtonOuter}
                            onPress={async () => {
                                const result = await setMode();
                                await update();
                                if (result === "normal") {
                                    Toast.show({
                                        type: "info",
                                        text1: "随机模式关闭",
                                    });
                                } else {
                                    Toast.show({
                                        type: "info",
                                        text1: "随机模式开启",
                                    });
                                }
                            }}
                            aria-label={
                                queuePlayingMode === "shuffle"
                                    ? "随机模式开启（点击以关闭）"
                                    : "随机模式关闭（点击以开启）"
                            }
                        >
                            <Entypo
                                name="shuffle"
                                size={22}
                                color={queuePlayingMode === "shuffle" ? theme.colors.accent[500] : textBasicColor}
                            />
                        </PotatoPressable>

                        <View style={styles.controlButtonsGroup}>
                            {/* 上一首 */}
                            <PotatoPressable
                                style={styles.controlButton}
                                outerStyle={styles.controlButtonOuter}
                                onPress={async () => {
                                    await handlePrev();
                                }}
                                aria-label="上一首"
                            >
                                <FontAwesome5
                                    name="step-backward"
                                    size={24}
                                    color={textBasicColor}
                                    style={styles.controlButtonIcon}
                                />
                            </PotatoPressable>

                            {/* 播放/暂停 */}
                            <PotatoPressable
                                style={styles.controlButtonPlay}
                                outerStyle={styles.controlButtonOuter}
                                pressedBackgroundColor={theme.colorTokens.buttonBackground("primary", "active")}
                                onPress={async () => {
                                    await handleTogglePlay();
                                }}
                                aria-label="播放/暂停"
                            >
                                <AudioPlayButtonIcon />
                            </PotatoPressable>

                            {/* 下一首 */}
                            <PotatoPressable
                                style={styles.controlButton}
                                outerStyle={styles.controlButtonOuter}
                                onPress={async () => {
                                    await TrackPlayer.skipToNext();
                                }}
                                aria-label="下一首"
                            >
                                <FontAwesome5
                                    name="step-forward"
                                    size={24}
                                    color={textBasicColor}
                                    style={styles.controlButtonIcon}
                                />
                            </PotatoPressable>
                        </View>

                        {/* 导出 */}
                        <PotatoPressable
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
                            aria-label="导出"
                        >
                            <Ionicons name="save" size={20} color={textBasicColor} />
                        </PotatoPressable>
                    </View>
                </View>
            </CommonLayout>
        </View>
    );
}

const styleSheet = createStyleSheet(theme => ({
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
        // justifyContent: "space-between",
        paddingTop: 8,
    },
    timerText: {
        fontSize: 15,
        opacity: 0.6,
        color: theme.colorTokens.foreground,
        flex: 1,
        fontFamily: "Roboto_400Regular",
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
}));
