import React, { useCallback, useMemo, useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import { BottomSheetBackdrop, BottomSheetFlashList, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { Text } from "~/components/ui/text";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { jump, next, prev, seek, toggle, useCurrentTrack, useIsPlaying, useQueue } from "@bilisound/player";
import { Image } from "expo-image";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { breakpoints, shadow } from "~/constants/styles";
import { Pressable } from "~/components/ui/pressable";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { Slider } from "@miblanchard/react-native-slider";
import Animated, {
    Easing,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { PLACEHOLDER_AUDIO } from "~/constants/playback";
import { Monicon } from "@monicon/native";
import { Button, ButtonOuter } from "~/components/ui/button";
import { useProgressSecond } from "~/hooks/useProgressSecond";
import { formatSecond } from "~/utils/datetime";
import { router } from "expo-router";
import { TrackData } from "@bilisound/player/build/types";
import * as TabsPrimitive from "@rn-primitives/tabs";
import { FlashList } from "@shopify/flash-list";
import { SongItem } from "~/components/song-item";

function isLoading(activeTrack: TrackData | null | undefined, duration: number) {
    return activeTrack?.uri === PLACEHOLDER_AUDIO || duration <= 0;
}

function PlayButtonIcon({ size = 28 }: { size?: number }) {
    const duration = 200;
    const isPlaying = useIsPlaying();
    const { colorValue } = useRawThemeValues();

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

    if (isLoading(useCurrentTrack(), useProgressSecond().duration)) {
        return <ActivityIndicator size={size} className={"size-8 color-background-0"} />;
    }

    return (
        <View className="relative size-8">
            <Animated.View style={pauseAnimatedStyle} className="absolute size-full items-center justify-center">
                <Monicon name="fa6-solid:pause" size={size / 0.875} color={colorValue("--color-background-0")} />
            </Animated.View>
            <Animated.View style={playAnimatedStyle} className="absolute size-full items-center justify-center">
                <Monicon name="fa6-solid:play" size={size} color={colorValue("--color-background-0")} />
            </Animated.View>
        </View>
    );
}

function PlayerProgressBar() {
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
    const activeTrack = useCurrentTrack();
    const { position, buffered, duration } = useProgressSecond();

    useEffect(() => {
        if (!holding) {
            setValue(position);
        }
    }, [holding, position]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: glowPosition.value - glowWidth }],
    }));

    if (isLoading(activeTrack, duration)) {
        return (
            <View
                onLayout={e => setGlowTotalWidth(e.nativeEvent.layout.width - 20)}
                className="h-4 justify-center flex-1 relative px-2"
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
        <NativeViewGestureHandler disallowInterruption={true}>
            <View className="h-4 justify-center flex-1 relative">
                <View className="left-[8px] right-[8px] top-[6.5px] h-[0.1875rem] rounded-full absolute overflow-hidden bg-neutral-200 dark:bg-primary-100">
                    <View
                        style={{ width: `${(buffered / duration) * 100}%` }}
                        className="h-full absolute bg-neutral-200 dark:bg-primary-100"
                    />
                    <View
                        style={{ width: `${(value / duration) * 100}%` }}
                        className="h-full absolute bg-primary-500"
                    />
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
                            await seek(val[0]);
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
                        renderThumbComponent={() => <View className="w-4 h-4 bg-primary-500 rounded-full" />}
                    />
                </View>
            </View>
        </NativeViewGestureHandler>
    );
}

function PlayerProgressTimer() {
    // 播放状态
    const activeTrack = useCurrentTrack();
    const { position } = useProgressSecond();

    let from = formatSecond(position);
    let to = activeTrack ? formatSecond(activeTrack.duration || 0) : "--:--";

    if (activeTrack?.uri === PLACEHOLDER_AUDIO) {
        from = "00:00";
    }

    return (
        <View className={"flex-row justify-between px-8 " + DEBUG_COLOR[1]}>
            <Text className={"text-sm text-typography-500"}>{from}</Text>
            <Text className={"text-sm text-typography-500"}>{to}</Text>
        </View>
    );
}

function PlayerControlButtons() {
    const { colorValue } = useRawThemeValues();
    const isPlaying = useIsPlaying();

    const [layoutWidth, setLayoutWidth] = useState(384);
    const isNarrow = layoutWidth < 384;
    const iconSize = isNarrow ? 24 : 28;
    const iconJumpSize = isNarrow ? 38 : 44;
    const buttonSize = isNarrow ? "w-14 h-14" : "w-16 h-16";

    // console.log("layoutWidth", layoutWidth);

    return (
        <View
            className={`flex-row justify-center ${isNarrow ? "gap-3" : "gap-4"} pt-2 pb-8 md:pb-0 ` + DEBUG_COLOR[1]}
            onLayout={e => setLayoutWidth(e.nativeEvent.layout.width)}
        >
            <ButtonOuter className={`rounded-full ${buttonSize}`}>
                <Button aria-label={"上一首"} className={buttonSize} onPress={() => prev()} variant={"ghost"}>
                    <View className={"size-[44px] items-center justify-center"}>
                        <Monicon
                            name={"ri:skip-back-mini-fill"}
                            size={iconJumpSize}
                            color={colorValue("--color-primary-500")}
                        />
                    </View>
                </Button>
            </ButtonOuter>
            <ButtonOuter className={`rounded-full ${buttonSize}`}>
                <Button aria-label={isPlaying ? "暂停" : "播放"} className={buttonSize} onPress={() => toggle()}>
                    <PlayButtonIcon size={iconSize} />
                </Button>
            </ButtonOuter>
            <ButtonOuter className={`rounded-full ${buttonSize}`}>
                <Button aria-label={"下一首"} className={buttonSize} onPress={() => next()} variant={"ghost"}>
                    <View className={"size-[44px] items-center justify-center rotate-180"}>
                        <Monicon
                            name={"ri:skip-back-mini-fill"}
                            size={iconJumpSize}
                            color={colorValue("--color-primary-500")}
                        />
                    </View>
                </Button>
            </ButtonOuter>
        </View>
    );
}

function PlayerPicture() {
    const currentTrack = useCurrentTrack();
    const [imageSize, setImageSize] = useState(0);

    return (
        <View
            className={"flex-1 items-center justify-center overflow-hidden"}
            onLayout={event => {
                const { width, height } = event.nativeEvent.layout;
                // padding 是 32dp `p-8`
                setImageSize(Math.min(width, height) - 64);
            }}
        >
            <View
                style={{ width: imageSize, height: imageSize, boxShadow: shadow["xl"] }}
                className={"rounded-2xl overflow-hidden"}
            >
                <Image source={currentTrack?.artworkUri} className={"size-full"}></Image>
            </View>
        </View>
    );
}

function PlayerQueueList() {
    const queue = useQueue();
    return (
        <View className={"py-4 md:py-0 flex-1"}>
            <BottomSheetFlashList
                data={queue}
                renderItem={({ item, index }) => (
                    <SongItem
                        data={{
                            id: 0,
                            title: item.title!,
                            imgUrl: "",
                            duration: item.duration!,
                            extendedData: null,
                            playlistId: 0,
                            author: "",
                            bvid: item.extendedData!.id,
                            episode: item.extendedData!.episode,
                        }}
                        index={index + 1}
                        onRequestPlay={() => jump(index)}
                        onToggle={() => toggle()}
                    />
                )}
            />
        </View>
    );
}

// const DEBUG_COLOR = ["bg-red-500", "bg-yellow-500", "bg-green-500"];
const DEBUG_COLOR = ["", "", ""];

const TABS = [
    {
        value: "current",
        label: "正在播放",
    },
    {
        value: "list",
        label: "播放队列",
    },
];

// 可能在其它形式的页面复用
export function PlayerControl() {
    const currentTrack = useCurrentTrack();
    const { close } = useBottomSheetStore(state => ({
        close: state.close,
    }));
    const [closing, setClosing] = useState(false);
    const [value, setValue] = useState<"current" | "list">("current");

    function handleJump() {
        if (closing) {
            return;
        }
        if (!currentTrack) {
            return;
        }
        close();
        setClosing(true);
        setTimeout(() => {
            router.navigate(`/video/${currentTrack.extendedData?.id}`);
            setClosing(false);
        }, 250);
    }

    const isHorizontal = useWindowDimensions().width >= breakpoints.md;

    return (
        <View className={"flex-1 flex-col md:flex-row"}>
            {/* 左侧：曲目图片 */}
            <TabsPrimitive.Root
                value={value}
                onValueChange={setValue as Dispatch<SetStateAction<string>>}
                className={"flex-1 md:flex-row"}
            >
                <View className={"items-center pt-4 px-4 " + "md:justify-center md:pb-4"}>
                    <TabsPrimitive.List
                        className={
                            "flex-0 w-48 h-10 flex-row items-center justify-center rounded-md bg-background-100 px-1 py-0 " +
                            "md:w-10 md:h-56 md:flex-col md:px-0 md:py-1"
                        }
                    >
                        {TABS.map(tab => (
                            <TabsPrimitive.Trigger
                                key={tab.value}
                                value={tab.value}
                                className={
                                    "flex-1 items-center justify-center rounded-sm max-md:h-8 px-3 py-0 " +
                                    "md:w-8 md:px-0 md:py-3 " +
                                    (value === tab.value ? "bg-background-0" : "")
                                }
                                style={{ boxShadow: value === tab.value ? shadow["sm"] : undefined }}
                                aria-label={tab.label}
                            >
                                <Text
                                    className={
                                        "text-sm font-medium whitespace-nowrap md:leading-tight " +
                                        (value === tab.value ? "text-typography-700" : "text-typography-500")
                                    }
                                >
                                    {isHorizontal ? tab.label.split("").join("\n") : tab.label}
                                </Text>
                            </TabsPrimitive.Trigger>
                        ))}
                    </TabsPrimitive.List>
                </View>
                <TabsPrimitive.Content value="current" className={"flex-1"}>
                    <PlayerPicture />
                </TabsPrimitive.Content>
                <TabsPrimitive.Content value="list" className={"flex-1"}>
                    <PlayerQueueList />
                </TabsPrimitive.Content>
            </TabsPrimitive.Root>

            {/* 右侧：播放控制 */}
            <View
                className={"@container flex-0 basis-auto md:flex-1 md:justify-center gap-3 @sm:gap-4 " + DEBUG_COLOR[0]}
            >
                {/* 曲目信息，可点击 */}
                <Pressable className={"gap-1.5 @sm:gap-2 py-2 @sm:py-4 px-8 " + DEBUG_COLOR[1]} onPress={handleJump}>
                    <Text
                        className={"leading-normal text-lg @sm:text-xl font-extrabold color-typography-700"}
                        isTruncated
                    >
                        {currentTrack?.title}
                    </Text>
                    <Text className={"leading-normal text-sm color-typography-500"}>{currentTrack?.artist}</Text>
                </Pressable>

                <View className={"gap-1.5"}>
                    {/* 进度条 */}
                    <View className={"flex-row items-center h-4 px-6 " + DEBUG_COLOR[1]}>
                        <PlayerProgressBar />
                    </View>

                    {/* 播放状态 */}
                    <PlayerProgressTimer />
                </View>

                {/* 曲目控制按钮 */}
                <PlayerControlButtons />
            </View>
        </View>
    );
}

export function MainBottomSheet() {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { isOpen, close } = useBottomSheetStore();

    // 主题色调用
    const { colorValue } = useRawThemeValues();

    // 设置可用的快照点（0 = 关闭，1 = 全屏）
    const snapPoints = useMemo(() => ["100%"], []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
        [],
    );

    useEffect(() => {
        // console.log(isOpen);
        if (isOpen) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [isOpen]);

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose
            onDismiss={close}
            handleComponent={null}
            enableDynamicSizing={false}
            backgroundStyle={{ backgroundColor: colorValue("--color-background-0"), borderRadius: 0 }}
            activeOffsetY={[-1, 1]}
            failOffsetX={[-5, 5]}
        >
            <BottomSheetView className={"w-full h-full p-safe flex-1 " + DEBUG_COLOR[2]}>
                <PlayerControl />
            </BottomSheetView>
        </BottomSheetModal>
    );
}
