import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { Text } from "~/components/ui/text";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { next, prev, seek, toggle, useCurrentTrack, useIsPlaying } from "@bilisound/player";
import { Image } from "expo-image";
import { ActivityIndicator, View } from "react-native";
import { shadow } from "~/constants/styles";
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

function isLoading(activeTrack: TrackData | null | undefined, duration: number) {
    return activeTrack?.uri === PLACEHOLDER_AUDIO || duration <= 0;
}

function PlayButtonIcon() {
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
        return <ActivityIndicator size={28} className={"size-8 color-background-0"} />;
    }

    return (
        <View className="relative size-8">
            <Animated.View style={pauseAnimatedStyle} className="absolute size-full items-center justify-center">
                <Monicon name="fa6-solid:pause" size={32} color={colorValue("--color-background-0")} />
            </Animated.View>
            <Animated.View style={playAnimatedStyle} className="absolute size-full items-center justify-center">
                <Monicon name="fa6-solid:play" size={28} color={colorValue("--color-background-0")} />
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

    return (
        <View className={"flex-row justify-center gap-4 pt-2 pb-8 md:pb-0 " + DEBUG_COLOR[1]}>
            <ButtonOuter className={"rounded-full size-16"}>
                <Button aria-label={"上一首"} className={"w-16 h-16"} onPress={() => prev()} variant={"ghost"}>
                    <View className={"size-[44px] items-center justify-center"}>
                        <Monicon name={"ri:skip-back-mini-fill"} size={44} color={colorValue("--color-primary-500")} />
                    </View>
                </Button>
            </ButtonOuter>
            <ButtonOuter className={"rounded-full size-16"}>
                <Button aria-label={isPlaying ? "暂停" : "播放"} className={"w-16 h-16"} onPress={() => toggle()}>
                    <PlayButtonIcon />
                </Button>
            </ButtonOuter>
            <ButtonOuter className={"rounded-full size-16"}>
                <Button aria-label={"下一首"} className={"w-16 h-16"} onPress={() => next()} variant={"ghost"}>
                    <View className={"size-[44px] items-center justify-center rotate-180"}>
                        <Monicon name={"ri:skip-back-mini-fill"} size={44} color={colorValue("--color-primary-500")} />
                    </View>
                </Button>
            </ButtonOuter>
        </View>
    );
}

// const DEBUG_COLOR = ["bg-red-500", "bg-yellow-500", "bg-green-500"];
const DEBUG_COLOR = ["", "", ""];

// 可能在其它形式的页面复用
export function PlayerControl() {
    const currentTrack = useCurrentTrack();
    const [imageSize, setImageSize] = useState(0);
    const { close } = useBottomSheetStore(state => ({
        close: state.close,
    }));
    const [closing, setClosing] = useState(false);

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

    return (
        <View className={"flex-1 flex-col md:flex-row"}>
            {/* 曲目图片 */}
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

            <View className={"flex-0 basis-auto md:flex-1 md:justify-center gap-4 " + DEBUG_COLOR[0]}>
                {/* 曲目信息，可点击 */}
                <Pressable className={"gap-2 py-4 px-8 " + DEBUG_COLOR[1]} onPress={handleJump}>
                    <Text className={"leading-normal text-xl font-extrabold color-typography-700"} isTruncated>
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
            backgroundStyle={{ backgroundColor: colorValue("--color-background-0") }}
            activeOffsetY={[-1, 1]}
            failOffsetX={[-5, 5]}
        >
            <BottomSheetView className={"w-full h-full p-safe flex-1 " + DEBUG_COLOR[2]}>
                <PlayerControl />
            </BottomSheetView>
        </BottomSheetModal>
    );
}
