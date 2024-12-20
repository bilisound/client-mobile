import { FontAwesome5, Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform, Linking, StatusBar, useColorScheme, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { ShadowedView } from "react-native-fast-shadow";
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import Animated, {
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import TrackPlayer, { State, useActiveTrack, usePlaybackState, useProgress } from "react-native-track-player";

import CommonLayout from "~/components/CommonLayout";
import SongItem from "~/components/SongItem";
import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { createIcon } from "~/components/potato-ui/utils/icon";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
} from "~/components/ui/actionsheet";
import { Box } from "~/components/ui/box";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { Pressable } from "~/components/ui/pressable";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import useTracks from "~/hooks/useTracks";
import { QUEUE_PLAYING_MODE, queueStorage } from "~/storage/queue";
import useSettingsStore from "~/store/settings";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { formatSecond } from "~/utils/datetime";
import { saveFile } from "~/utils/file";
import { getFileName } from "~/utils/format";
import log from "~/utils/logger";
import { handlePrev, handleTogglePlay } from "~/utils/player-control";
import { setMode, tracksToPlaylist } from "~/utils/track-data";

const IconMenu = createIcon(Entypo, "dots-three-vertical");
const IconDown = createIcon(Entypo, "chevron-down");

const AudioPlayerInsetContext = createContext<EdgeInsets & { width: number; height: number }>({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
});

function AudioProgressBar() {
    const { colorValue } = useRawThemeValues();

    const [value, setValue] = useState(0);
    const [holding, setHolding] = useState(false);

    // 进度提示
    const [glowTotalWidth, setGlowTotalWidth] = useState(0);
    const glowWidth = glowTotalWidth * 1.5;
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
                className="h-4 justify-center flex-1 relative px-[0.625rem]"
            >
                <View className="h-[0.1875rem] rounded-full overflow-hidden bg-primary-100 dark:bg-primary-100">
                    <Animated.View style={[{ width: glowWidth, height: 3 }, animatedStyle]}>
                        <LinearGradient
                            colors={[
                                colorValue("--color-primary-100"),
                                colorValue("--color-primary-400"),
                                colorValue("--color-primary-100"),
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="w-full h-full"
                        />
                    </Animated.View>
                </View>
            </View>
        );
    }

    return (
        <View className="h-4 justify-center flex-1 relative">
            <View className="left-[0.625rem] right-[0.625rem] top-[6.5px] h-[0.1875rem] rounded-full absolute overflow-hidden bg-neutral-200 dark:bg-primary-100">
                <View
                    style={{ width: `${(buffered / duration) * 100}%` }}
                    className="h-full absolute bg-neutral-200 dark:bg-primary-100"
                />
                <View style={{ width: `${(value / duration) * 100}%` }} className="h-full absolute bg-primary-500" />
            </View>
            <View className="absolute px-2 w-full">
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
                    containerStyle={{ width: "100%" }}
                    trackStyle={{
                        backgroundColor: "transparent",
                    }}
                    minimumTrackStyle={{
                        backgroundColor: "transparent",
                    }}
                    renderThumbComponent={() => <Box className="w-4 h-4 bg-primary-500 rounded-full" />}
                />
            </View>
        </View>
    );
}

function AudioProgressTimer() {
    const { position, duration } = useProgress();
    const activeTrack = useActiveTrack();

    return (
        <View className="px-[1.875rem] flex-row items-center pt-1.5 @md:pt-2">
            <Text
                className="text-sm @md:text-[0.9375rem] opacity-60 flex-1 text-left"
                style={{
                    fontFamily: "Roboto_400Regular",
                }}
            >
                {activeTrack?.bilisoundIsLoaded ? formatSecond(position) : "00:00"}
            </Text>
            <Text
                className="text-sm @md:text-[0.9375rem] opacity-60 flex-1 text-right"
                style={{
                    fontFamily: "Roboto_400Regular",
                }}
            >
                {activeTrack?.bilisoundIsLoaded ? formatSecond(duration) : "00:00"}
            </Text>
        </View>
    );
}

function AudioPlayButtonIcon() {
    const duration = 200;
    const playbackState = usePlaybackState();
    const isPlaying = playbackState.state === State.Playing;

    const pauseScale = useSharedValue(isPlaying ? 1 : 0);
    const pauseOpacity = useSharedValue(isPlaying ? 1 : 0);
    const playScale = useSharedValue(isPlaying ? 0 : 1);
    const playOpacity = useSharedValue(isPlaying ? 0 : 1);

    useEffect(() => {
        pauseScale.value = withTiming(isPlaying ? 1 : 0, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        pauseOpacity.value = withTiming(isPlaying ? 1 : 0, {
            duration,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        playScale.value = withTiming(isPlaying ? 0 : 1, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
        playOpacity.value = withTiming(isPlaying ? 0 : 1, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    }, [isPlaying, pauseOpacity, pauseScale, playOpacity, playScale]);

    const pauseAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pauseScale.value }],
            opacity: pauseOpacity.value,
        };
    });

    const playAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: playScale.value }],
            opacity: playOpacity.value,
        };
    });

    return (
        <View className="relative size-[1.5rem] @md:size-[1.875rem]">
            <Animated.View style={pauseAnimatedStyle} className="absolute size-full items-center justify-center">
                <FontAwesome5
                    name="pause"
                    size={-1}
                    className="color-typography-0 text-[1.375rem] @md:text-[1.75rem]"
                />
            </Animated.View>
            <Animated.View style={playAnimatedStyle} className="absolute size-full items-center justify-center">
                <FontAwesome5 name="play" size={-1} className="color-typography-0 text-[1.375rem] @md:text-[1.75rem]" />
            </Animated.View>
        </View>
    );
}

function MusicPicture({ image, bilisoundId }: { image?: string; bilisoundId?: string }) {
    const colorScheme = useColorScheme();
    const [smallestSize, setSmallestSize] = useState(0);
    const edgeInsets = useContext(AudioPlayerInsetContext);
    const [shouldPaddingBottom, setShouldPaddingBottom] = useState(false);

    let inner = <Skeleton style={{ width: smallestSize, borderRadius: 16, aspectRatio: "1/1" }} />;

    if (image) {
        inner =
            colorScheme === "dark" ? (
                <Image
                    source={getImageProxyUrl(image ?? "", bilisoundId ?? "")}
                    // 不能用 className，否则 web 不正常
                    style={{ width: smallestSize, borderRadius: 16, aspectRatio: "1/1" }}
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
                        shadowColor: "#000000",
                    }}
                >
                    <Image
                        source={getImageProxyUrl(image, bilisoundId ?? "")}
                        // 不能用 className，否则 web 不正常
                        style={{ width: smallestSize, borderRadius: 16, aspectRatio: "1/1" }}
                        contentFit="cover"
                    />
                </ShadowedView>
            );
    }

    return (
        <View
            className="flex-1 items-center justify-center"
            onLayout={e => {
                const layout = e.nativeEvent.layout;
                setSmallestSize(Math.min(layout.width, layout.height) - 64);
                setShouldPaddingBottom(layout.width >= 768);
            }}
            style={{
                paddingBottom: shouldPaddingBottom ? edgeInsets.bottom : 0,
            }}
        >
            {inner}
        </View>
    );
}

function MusicList() {
    const { tracks } = useTracks();
    const edgeInsets = useContext(AudioPlayerInsetContext);

    // 转换后的列表
    const convertedTrack = useMemo(() => tracksToPlaylist(tracks), [tracks]);

    return (
        <View className="flex-1 mb-2 @md:mb-6 @3xl:mb-0">
            <View className="flex-1 border border-l-0 border-r-0 border-outline-50 @3xl:border-0">
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
                    ListHeaderComponent={<View className="h-2" />}
                    ListFooterComponent={
                        <>
                            <View className="flex @3xl:hidden h-2" />
                            <View className="hidden @3xl:flex" style={{ height: edgeInsets.bottom + 8 }} />
                        </>
                    }
                    data={convertedTrack}
                    estimatedItemSize={64}
                    extraData={[]}
                />
            </View>
        </View>
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
                "h-full items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 transition-all disabled:pointer-events-none disabled:opacity-50" +
                (active ? " bg-background-0" : "")
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

interface LongPressActionsProps {
    showActionSheet: boolean;
    onClose: () => void;
    onAction: (action: "changeRandom" | "save" | "close") => void;
}

/**
 * 长按操作
 */
function LongPressActions({ showActionSheet, onAction, onClose }: LongPressActionsProps) {
    const edgeInsets = useSafeAreaInsets();
    const [queuePlayingMode] = useMMKVString(QUEUE_PLAYING_MODE, queueStorage);

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose} style={{ zIndex: 999 }}>
            <ActionsheetBackdrop />
            <ActionsheetContent style={{ zIndex: 999, paddingBottom: edgeInsets.bottom }}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                <ActionsheetItem onPress={() => onAction("changeRandom")}>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Entypo
                            name="shuffle"
                            className={`text-[1.25rem] ${queuePlayingMode === "shuffle" ? "color-accent-500" : "color-typography-700"}`}
                        />
                    </View>
                    <ActionsheetItemText>{`${queuePlayingMode === "shuffle" ? "关闭随机播放" : "开启随机播放"}`}</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("save")}>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name="save" className="text-[1.25rem] color-typography-700" />
                    </View>
                    <ActionsheetItemText>保存</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("close")}>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MaterialIcons name="cancel" className="text-[1.375rem] color-typography-700" />
                    </View>
                    <ActionsheetItemText>取消</ActionsheetItemText>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    );
}

function AudioPlayerModal() {
    const { initialImage, initialTitle, initialArtist } = useLocalSearchParams<{
        initialImage?: string;
        initialTitle?: string;
        initialArtist?: string;
    }>();
    const colorScheme = useColorScheme();
    const { colorValue } = useRawThemeValues();
    const activeTrack = useActiveTrack();
    const [showList, setShowList] = useState(false);
    const { useLegacyID } = useSettingsStore(state => ({
        useLegacyID: state.useLegacyID,
    }));
    const [queuePlayingMode] = useMMKVString(QUEUE_PLAYING_MODE, queueStorage);
    const { update } = useTracks();
    const edgeInsets = useSafeAreaInsets();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const customEdgeInsets = {
        ...edgeInsets,
        top: Platform.OS === "ios" ? 0 : edgeInsets.top,
        width,
        height,
    };
    const [shouldMarginBottom, setShouldMarginBottom] = useState(false);
    const [superNarrowLayout, setSuperNarrowLayout] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    function handleClose() {
        setShowMenu(false);
    }

    async function handleSave() {
        if (Platform.OS === "web") {
            await Linking.openURL(`${activeTrack?.url}&dl=${useSettingsStore.getState().useLegacyID ? "av" : "bv"}`);
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
    }

    async function handleToggleShuffle() {
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
    }

    return (
        <AudioPlayerInsetContext.Provider value={customEdgeInsets}>
            {Platform.OS === "ios" ? <SystemBars style="light" /> : null}
            <View
                className="flex-1 bg-background-0 @container"
                onLayout={e => {
                    log.debug("当前播放器视窗宽度：" + e.nativeEvent.layout.width);
                    setShouldMarginBottom(e.nativeEvent.layout.width < 768);
                    setSuperNarrowLayout(e.nativeEvent.layout.width < 320);
                    setWidth(e.nativeEvent.layout.width);
                    setHeight(e.nativeEvent.layout.height);
                }}
            >
                <CommonLayout
                    overrideEdgeInsets={{ ...customEdgeInsets, bottom: 0 }}
                    titleBarClassName="h-[4.5rem] px-[0.875rem]"
                    titleBarTheme="transparent"
                    containerClassName="flex-col @3xl:flex-row"
                    title={
                        <View className="h-10 items-center justify-center rounded-lg bg-background-100 p-1 gap-1 flex-row">
                            {/* key 是切换选项卡后阴影停滞问题的 workaround */}
                            <TopTabButton
                                key={`${showList}_正在播放`}
                                active={!showList}
                                onPress={() => setShowList(false)}
                            >
                                {superNarrowLayout ? "播放" : `正在播放`}
                            </TopTabButton>
                            <TopTabButton
                                key={`${showList}_播放队列`}
                                active={showList}
                                onPress={() => setShowList(true)}
                            >
                                {superNarrowLayout ? "队列" : `播放队列`}
                            </TopTabButton>
                        </View>
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
                    rightAccessories={
                        Platform.OS !== "ios" && superNarrowLayout ? (
                            <PotatoButtonTitleBar
                                label="操作"
                                onPress={() => {
                                    setShowMenu(true);
                                }}
                                Icon={IconMenu}
                                iconSize={18}
                                theme="transparent"
                            />
                        ) : null
                    }
                >
                    <View className="flex-1">
                        {Platform.OS === "ios" ? null : (
                            <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
                        )}
                        {showList ? (
                            <MusicList />
                        ) : (
                            <MusicPicture
                                image={activeTrack?.artwork ?? initialImage}
                                bilisoundId={activeTrack?.bilisoundId}
                            />
                        )}
                    </View>
                    <View
                        className="flex-0 @3xl:flex-1 basis-auto h-[13.75rem] @md:h-64 @3xl:h-full @3xl:justify-center"
                        style={{
                            marginBottom: shouldMarginBottom ? customEdgeInsets.bottom : undefined,
                            paddingBottom: shouldMarginBottom ? undefined : customEdgeInsets.bottom,
                        }}
                    >
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
                            <View className="px-[1.875rem] py-2 @md:py-4 gap-2">
                                <Text
                                    className="text-[1.125rem] @md:text-[1.25rem] font-extrabold leading-normal truncate whitespace-nowrap"
                                    isTruncated
                                >
                                    {activeTrack?.title ?? initialTitle}
                                </Text>
                                <Text className="text-sm @md:text-base leading-normal opacity-65" isTruncated>
                                    {activeTrack?.artist ?? initialArtist}
                                </Text>
                            </View>
                        </PotatoPressable>
                        <View className="flex-row items-center h-4 px-5 mt-2">
                            <AudioProgressBar />
                        </View>
                        <AudioProgressTimer />
                        <View className="flex-row items-center justify-between pt-5 px-5">
                            {/* 随机模式 */}
                            <PotatoPressable
                                className={`w-10 h-10 items-center justify-center ${superNarrowLayout ? "hidden" : ""}`}
                                outerClassName="overflow-hidden rounded-full"
                                onPress={handleToggleShuffle}
                                aria-label={
                                    queuePlayingMode === "shuffle"
                                        ? "随机模式开启（点击以关闭）"
                                        : "随机模式关闭（点击以开启）"
                                }
                            >
                                <Entypo
                                    name="shuffle"
                                    size={-1}
                                    className={`text-[1.125rem] @md:text-[1.375rem] ${queuePlayingMode === "shuffle" ? "color-accent-500" : "color-typography-700"}`}
                                />
                            </PotatoPressable>

                            <View className="flex-row items-center justify-center gap-3">
                                {/* 上一首 */}
                                <PotatoPressable
                                    className="w-14 h-14 @sm:w-[4.25rem] @sm:h-[4.25rem] items-center justify-center"
                                    outerClassName="overflow-hidden rounded-full"
                                    onPress={async () => {
                                        await handlePrev();
                                    }}
                                    aria-label="上一首"
                                >
                                    <FontAwesome5
                                        name="step-backward"
                                        size={-1}
                                        className="text-[1.25rem] @md:text-[1.5rem] color-typography-700 scale-x-[1.4]"
                                    />
                                </PotatoPressable>

                                {/* 播放/暂停 */}
                                <PotatoPressable
                                    className="w-14 h-14 @sm:w-[4.25rem] @sm:h-[4.25rem] items-center justify-center bg-primary-500"
                                    outerClassName="overflow-hidden rounded-full"
                                    hoverClassName="bg-primary-600"
                                    pressedClassName="bg-primary-700"
                                    rippleColor={colorValue("--color-primary-700")}
                                    onPress={async () => {
                                        await handleTogglePlay();
                                    }}
                                    aria-label="播放/暂停"
                                >
                                    <AudioPlayButtonIcon />
                                </PotatoPressable>

                                {/* 下一首 */}
                                <PotatoPressable
                                    className="w-14 h-14 @sm:w-[4.25rem] @sm:h-[4.25rem] items-center justify-center"
                                    outerClassName="overflow-hidden rounded-full"
                                    onPress={async () => {
                                        await TrackPlayer.skipToNext();
                                    }}
                                    aria-label="下一首"
                                >
                                    <FontAwesome5
                                        name="step-forward"
                                        size={-1}
                                        className="text-[1.25rem] @md:text-[1.5rem] color-typography-700 scale-x-[1.4]"
                                    />
                                </PotatoPressable>
                            </View>

                            {/* 导出 */}
                            <PotatoPressable
                                className={`w-10 h-10 items-center justify-center ${superNarrowLayout ? "hidden" : ""}`}
                                outerClassName="overflow-hidden rounded-full"
                                onPress={handleSave}
                                aria-label="导出"
                            >
                                <Ionicons
                                    name="save"
                                    size={-1}
                                    className="text-[1.125rem] @md:text-[1.25rem] color-typography-700"
                                />
                            </PotatoPressable>
                        </View>
                    </View>
                </CommonLayout>
                <LongPressActions
                    showActionSheet={showMenu}
                    onClose={handleClose}
                    onAction={e => {
                        switch (e) {
                            case "changeRandom":
                                handleToggleShuffle();
                                break;
                            case "save":
                                handleSave();
                                break;
                            case "close":
                            default:
                                break;
                        }
                        handleClose();
                    }}
                />
            </View>
        </AudioPlayerInsetContext.Provider>
    );
}

export default function ModalScreen() {
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
}
