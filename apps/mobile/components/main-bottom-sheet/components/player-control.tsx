import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { InsidePageContext } from "~/components/main-bottom-sheet/utils";
import { useCurrentTrack } from "@bilisound/player";
import { useActionSheetStore } from "~/components/main-bottom-sheet/stores";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { router } from "expo-router";
import { View } from "react-native";
import { breakpoints, shadow } from "~/constants/styles";
import { LayoutButton } from "~/components/layout-button";
import * as TabsPrimitive from "@rn-primitives/tabs";
import { DEBUG_COLOR, TABS } from "~/components/main-bottom-sheet/constants";
import { Text } from "~/components/ui/text";
import { PlayerPicture } from "./player-picture";
import { PlayerQueueList } from "./player-queue-list";
import { Pressable } from "~/components/ui/pressable";
import { PlayerProgressBar } from "./player-progress-bar";
import { PlayerProgressTimer } from "./player-progress-timer";
import { PlayerControlButtons } from "./player-control-buttons";
import { PlayerControlMenu } from "./player-control-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowSize } from "~/hooks/useWindowSize";

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
    const { width, height } = useWindowSize();
    const { top, left, right } = useSafeAreaInsets();

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

    const isHorizontal = width >= breakpoints.md;

    return (
        // iOS 下播放界面横屏布局问题的 workaround
        <View className={"flex-col md:flex-row p-safe"} style={{ width, height }}>
            <View className={"absolute z-10"} style={{ left: 10 + left, top: 10 + top }}>
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
            <View className={"absolute z-10"} style={{ right: 10 + right, top: 10 + top }}>
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
                className={"flex-1 md:flex-row bg-red-300"}
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
                className={
                    "bg-green-300 @container flex-0 basis-auto md:flex-1 md:justify-center gap-3 @sm:gap-4 " +
                    DEBUG_COLOR[0]
                }
            >
                {/* 曲目信息，可点击 */}
                <Pressable className={"gap-1.5 @sm:gap-2 py-2 @sm:py-4 " + DEBUG_COLOR[1]} onPress={handleJump}>
                    <Text
                        className={"leading-normal text-lg @sm:text-xl font-extrabold color-typography-700 px-8"}
                        isTruncated
                    >
                        {currentTrack?.title}
                    </Text>

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
