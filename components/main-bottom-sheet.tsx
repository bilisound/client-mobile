import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { Text } from "~/components/ui/text";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { seek, useCurrentTrack, useProgress } from "@bilisound/player";
import { Image } from "expo-image";
import { useWindowDimensions, View } from "react-native";
import { shadow } from "~/constants/styles";
import { Pressable } from "~/components/ui/pressable";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import { Slider } from "@miblanchard/react-native-slider";
import Animated, {
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { PLACEHOLDER_AUDIO } from "~/constants/playback";

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
    const { position, buffered, duration } = useProgress();

    useEffect(() => {
        if (!holding) {
            setValue(position);
        }
    }, [holding, position]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: glowPosition.value - glowWidth }],
    }));

    if (activeTrack?.uri === PLACEHOLDER_AUDIO || duration <= 0) {
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
                <View className="left-[0.625rem] right-[0.625rem] top-[6.5px] h-[0.1875rem] rounded-full absolute overflow-hidden bg-neutral-200 dark:bg-primary-100">
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

// const DEBUG_COLOR = ["bg-red-500", "bg-yellow-500"];
const DEBUG_COLOR = ["", ""];

function PlayerControl() {
    const currentTrack = useCurrentTrack();
    const [imageSize, setImageSize] = useState(0);

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

            <View className={"flex-0 basis-auto md:flex-1 " + DEBUG_COLOR[0]}>
                {/* 曲目信息，可点击 */}
                <Pressable className={"gap-2 py-4 px-8 " + DEBUG_COLOR[1]}>
                    <Text className={"leading-normal text-xl font-extrabold color-typography-700"} isTruncated>
                        {currentTrack?.title}
                    </Text>
                    <Text className={"leading-normal text-sm color-typography-500"}>{currentTrack?.artist}</Text>
                </Pressable>

                {/* 进度条 */}
                <View className={"flex-row items-center h-4 px-5 mt-2 " + DEBUG_COLOR[1]}>
                    <PlayerProgressBar />
                </View>
            </View>
        </View>
    );
}

export function MainBottomSheet() {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { isOpen, close } = useBottomSheetStore();
    const windowDimensions = useWindowDimensions();

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

    // console.log("windowDimensions " + JSON.stringify(windowDimensions));

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
            <BottomSheetView
                className={"p-safe"}
                // 缓解 bottom sheet 无法正确处理横屏的情况
                style={{ width: windowDimensions.width, height: windowDimensions.height }}
            >
                <PlayerControl />
            </BottomSheetView>
        </BottomSheetModal>
    );
}
