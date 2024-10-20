import { FontAwesome5, Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform, Linking, StatusBar, useColorScheme, View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import Animated, {
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import TrackPlayer, { State, useActiveTrack, usePlaybackState, useProgress } from "react-native-track-player";
import { useStyles } from "react-native-unistyles";

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
import { Pressable } from "~/components/ui/pressable";
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
import { rem2px } from "~/utils/styling";
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
    const colorScheme = useColorScheme();
    const { theme } = useStyles();

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
            <View
                onLayout={e => setGlowTotalWidth(e.nativeEvent.layout.width - 20)}
                className="h-4 justify-center flex-1 relative px-[10px]"
            >
                <View className="h-[3px] rounded-full overflow-hidden bg-neutral-200 dark:bg-primary-100">
                    <Animated.View style={[{ width: glowWidth, height: 3 }, animatedStyle]}>
                        <LinearGradient
                            colors={
                                colorScheme === "dark"
                                    ? [theme.colors.primary[900], theme.colors.primary[700], theme.colors.primary[900]]
                                    : [theme.colors.primary[200], theme.colors.primary[400], theme.colors.primary[200]]
                            }
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
            <View className="left-[10px] right-[10px] top-[6.5px] h-[3px] rounded-full absolute overflow-hidden bg-neutral-200 dark:bg-primary-100">
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
        <View className="px-[30px] flex-row items-center pt-1.5 @md:pt-2">
            <Text
                className="text-sm @md:text-[15px] opacity-60 flex-1 text-left"
                style={{
                    fontFamily: "Roboto_400Regular",
                }}
            >
                {activeTrack?.bilisoundIsLoaded ? formatSecond(position) : "00:00"}
            </Text>
            <Text
                className="text-sm @md:text-[15px] opacity-60 flex-1 text-right"
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
    const playbackState = usePlaybackState();
    const { width } = useContext(AudioPlayerInsetContext);

    return playbackState.state === State.Playing ? (
        <FontAwesome5 name="pause" size={width >= rem2px(28) ? 28 : 22} className="color-typography-0" />
    ) : (
        <FontAwesome5
            name="play"
            size={width >= rem2px(28) ? 28 : 22}
            className="color-typography-0 translate-x-[3px]"
        />
    );
}

function MusicPicture({ image, bilisoundId }: { image?: string; bilisoundId?: string }) {
    const colorScheme = useColorScheme();
    const [smallestSize, setSmallestSize] = useState(0);
    const edgeInsets = useContext(AudioPlayerInsetContext);
    const [shouldPaddingBottom, setShouldPaddingBottom] = useState(false);

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
            {colorScheme === "dark" ? (
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
                        source={getImageProxyUrl(image ?? "", bilisoundId ?? "")}
                        // 不能用 className，否则 web 不正常
                        style={{ width: smallestSize, borderRadius: 16, aspectRatio: "1/1" }}
                        contentFit="cover"
                    />
                </ShadowedView>
            )}
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
                            className={`text-[20px] ${queuePlayingMode === "shuffle" ? "color-accent-500" : "color-typography-700"}`}
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
                        <Ionicons name="save" className="text-[20px] color-typography-700" />
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
                        <MaterialIcons name="cancel" className="text-[22px] color-typography-700" />
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
    const { theme } = useStyles();
    const colorScheme = useColorScheme();
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
            {Platform.OS === "ios" ? <StatusBar barStyle="light-content" /> : null}
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
                    titleBarClassName="h-[72px] px-[14px]"
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
                            <StatusBar
                                barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                                showHideTransition="none"
                            />
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
                        className="flex-0 @3xl:flex-1 basis-auto h-[220px] @md:h-64 @3xl:h-full @3xl:justify-center"
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
                            <View className="px-[30px] py-2 @md:py-4 gap-2">
                                <Text
                                    className="text-[18px] @md:text-[20px] font-extrabold leading-normal truncate whitespace-nowrap"
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
                                    size={customEdgeInsets.width >= rem2px(28) ? 22 : 18}
                                    className={`${queuePlayingMode === "shuffle" ? "color-accent-500" : "color-typography-700"}`}
                                />
                            </PotatoPressable>

                            <View className="flex-row items-center justify-center gap-3">
                                {/* 上一首 */}
                                <PotatoPressable
                                    className="w-14 h-14 @sm:w-[68px] @sm:h-[68px] items-center justify-center"
                                    outerClassName="overflow-hidden rounded-full"
                                    onPress={async () => {
                                        await handlePrev();
                                    }}
                                    aria-label="上一首"
                                >
                                    <FontAwesome5
                                        name="step-backward"
                                        size={customEdgeInsets.width >= rem2px(28) ? 24 : 20}
                                        className="color-typography-700 scale-x-[1.4]"
                                    />
                                </PotatoPressable>

                                {/* 播放/暂停 */}
                                <PotatoPressable
                                    className="w-14 h-14 @sm:w-[68px] @sm:h-[68px] items-center justify-center"
                                    outerClassName="overflow-hidden rounded-full"
                                    style={{
                                        backgroundColor: theme.colorTokens.buttonBackground("primary", "default"),
                                    }}
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
                                    className="w-14 h-14 @sm:w-[68px] @sm:h-[68px] items-center justify-center"
                                    outerClassName="overflow-hidden rounded-full"
                                    onPress={async () => {
                                        await TrackPlayer.skipToNext();
                                    }}
                                    aria-label="下一首"
                                >
                                    <FontAwesome5
                                        name="step-forward"
                                        size={customEdgeInsets.width >= rem2px(28) ? 24 : 20}
                                        className="color-typography-700  scale-x-[1.4]"
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
                                    size={customEdgeInsets.width >= rem2px(28) ? 20 : 18}
                                    className="color-typography-700"
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
