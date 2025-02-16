import React, { useCallback, useMemo, useRef, useEffect, useState, Dispatch, SetStateAction, useContext } from "react";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { Text } from "~/components/ui/text";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { useCurrentTrack } from "@bilisound/player";
import { BackHandler, Platform, useWindowDimensions, View } from "react-native";
import { breakpoints, shadow } from "~/constants/styles";
import { Pressable } from "~/components/ui/pressable";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as TabsPrimitive from "@rn-primitives/tabs";
import Toast from "react-native-toast-message";
import { toastConfig } from "~/components/notify-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LayoutButton } from "~/components/layout-button";
import { Marquee } from "@animatereactnative/marquee";
import MaskedView from "@react-native-masked-view/masked-view";
import { InsidePageContext } from "./utils";
import { DEBUG_COLOR, TABS } from "./constants";
import { useActionSheetStore } from "./stores";
import { PlayerProgressBar } from "./components/player-progress-bar";
import { PlayerProgressTimer } from "./components/player-progress-timer";
import { PlayerControlButtons } from "./components/player-control-buttons";
import { PlayerControlMenu } from "~/components/main-bottom-sheet/components/player-control-menu";
import { PlayerPicture } from "~/components/main-bottom-sheet/components/player-picture";
import { PlayerQueueList } from "~/components/main-bottom-sheet/components/player-queue-list";

// 在页面版和 bottom sheet 版均有使用
export function PlayerControl() {
    const isInsidePage = useContext(InsidePageContext);
    const currentTrack = useCurrentTrack();
    const { setShowActionSheet } = useActionSheetStore(state => ({
        setShowActionSheet: state.setShowActionSheet,
    }));
    const { close } = useBottomSheetStore(state => ({
        close: state.close,
    }));
    const [closing, setClosing] = useState(false);
    const [value, setValue] = useState<"current" | "list">("current");
    const [rotateTitle, setRotateTitle] = useState(false);

    // 滚动字幕
    const { colorValue } = useRawThemeValues();
    const [width, setWidth] = useState(320);

    function handleJump() {
        if (closing) {
            return;
        }
        if (!currentTrack) {
            return;
        }
        if (isInsidePage) {
            router.replace(`/video/${currentTrack.extendedData?.id}`);
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
            <View className={"left-[10px] top-[10px] absolute z-10"}>
                <LayoutButton
                    iconName={"fa6-solid:angle-down"}
                    onPress={() => {
                        if (isInsidePage) {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace("/");
                            }
                        } else {
                            close();
                        }
                    }}
                />
            </View>
            <View className={"right-[10px] top-[10px] absolute z-10"}>
                <LayoutButton
                    iconName={"fa6-solid:ellipsis-vertical"}
                    onPress={() => {
                        setShowActionSheet(true);
                    }}
                />
            </View>
            {/* 左侧：曲目图片 */}
            <TabsPrimitive.Root
                value={value}
                onValueChange={setValue as Dispatch<SetStateAction<string>>}
                className={"flex-1 md:flex-row"}
            >
                <View className={"items-center p-3 " + "md:justify-center"}>
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
                                        "text-sm font-medium md:leading-tight " +
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
                onLayout={event => {
                    setWidth(event.nativeEvent.layout.width);
                }}
            >
                {/* 曲目信息，可点击 */}
                <Pressable
                    className={"gap-1.5 @sm:gap-2 py-2 @sm:py-4 " + DEBUG_COLOR[1]}
                    onPress={handleJump}
                    onLongPress={() => setRotateTitle(p => !p)}
                >
                    {rotateTitle ? (
                        <MaskedView
                            maskElement={
                                <Marquee speed={0.5}>
                                    <Text className={"text-lg @sm:text-xl font-extrabold color-typography-700 pl-8"}>
                                        {currentTrack?.title}
                                    </Text>
                                </Marquee>
                            }
                        >
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={[
                                    "transparent",
                                    colorValue("--color-typography-700"),
                                    colorValue("--color-typography-700"),
                                    "transparent",
                                ]}
                                locations={[16 / width, 64 / width, (width - 64) / width, (width - 16) / width]}
                                className={"h-[28px] @sm:h-[28px]"}
                            />
                        </MaskedView>
                    ) : (
                        <Text
                            className={"leading-normal text-lg @sm:text-xl font-extrabold color-typography-700 px-8"}
                            isTruncated
                        >
                            {currentTrack?.title}
                        </Text>
                    )}

                    <Text className={"leading-normal text-sm color-typography-500 px-8"}>{currentTrack?.artist}</Text>
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

            {/* 控制菜单 */}
            <PlayerControlMenu />
        </View>
    );
}

export function MainBottomSheet() {
    const edgeInsets = useSafeAreaInsets();
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
            <Toast config={toastConfig} topOffset={edgeInsets.top} />
        </BottomSheetModal>
    );
}

function MainBottomSheetCloseHostInner() {
    const { isOpen, close } = useBottomSheetStore();

    // 拦截系统返回事件
    useEffect(() => {
        const onBackPress = () => {
            // 开启 bottom sheet 时，关闭它
            if (isOpen) {
                close();
                return true;
            }
            // 普通返回
            if (router.canGoBack()) {
                router.back();
            } else {
                BackHandler.exitApp();
            }

            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => backHandler.remove();
    }, [isOpen, close]);

    return null;
}

export function MainBottomSheetCloseHost() {
    if (Platform.OS === "web") {
        return null;
    }
    return <MainBottomSheetCloseHostInner />;
}
