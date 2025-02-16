import React, { useCallback, useMemo, useRef, useEffect, useState, Dispatch, SetStateAction, useContext } from "react";
import { BottomSheetBackdrop, BottomSheetFlashList, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { Text } from "~/components/ui/text";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { jump, toggle, useCurrentTrack, useQueue } from "@bilisound/player";
import { Image } from "expo-image";
import { BackHandler, Platform, useWindowDimensions, View } from "react-native";
import { breakpoints, shadow } from "~/constants/styles";
import { Pressable } from "~/components/ui/pressable";
import { LinearGradient } from "expo-linear-gradient";
import { Monicon } from "@monicon/native";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { formatSecond } from "~/utils/datetime";
import { router } from "expo-router";
import * as TabsPrimitive from "@rn-primitives/tabs";
import { SongItem } from "~/components/song-item";
import Toast from "react-native-toast-message";
import { toastConfig } from "~/components/notify-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { convertToHTTPS } from "~/utils/string";
import { LayoutButton } from "~/components/layout-button";
import { FlashList } from "@shopify/flash-list";
import { useMMKVBoolean } from "react-native-mmkv";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
} from "~/components/ui/actionsheet";
import { SliderFilledTrack, SliderThumb, SliderTrack, Slider as GSSlider } from "~/components/ui/slider";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "~/components/ui/checkbox";
import { CheckIcon } from "~/components/ui/icon";
import { usePlaybackSpeedStore } from "~/store/playback-speed";
import { getBilisoundResourceUrlOnline } from "~/api/bilisound";
import { downloadResource } from "~/business/download";
import { CACHE_INVALID_KEY_DO_NOT_USE, cacheStatusStorage } from "~/storage/cache-status";
import useDownloadStore from "~/store/download";
import { openAddPlaylistPage } from "~/business/playlist/misc";
import { Marquee } from "@animatereactnative/marquee";
import { getCacheAudioPath, saveAudioFile, uriToPath } from "~/utils/file";
import useSettingsStore from "~/store/settings";
import { bv2av } from "~/utils/vendors/av-bv";
import log from "~/utils/logger";
import MaskedView from "@react-native-masked-view/masked-view";
import { ActionSheetCurrent } from "../action-sheet-current";
import { InsidePageContext } from "./utils";
import { DEBUG_COLOR, TABS, SPEED_PRESETS } from "./constants";
import { useActionSheetStore } from "./stores";
import { PlayerProgressBar } from "./components/player-progress-bar";
import { PlayerProgressTimer } from "./components/player-progress-timer";
import { PlayerControlButtons } from "./components/player-control-buttons";

function PlayerControlMenu() {
    const isInsidePage = useContext(InsidePageContext);
    const currentTrack = useCurrentTrack();
    const [currentCache] = useMMKVBoolean(
        currentTrack?.extendedData
            ? currentTrack.extendedData.id + "_" + currentTrack.extendedData.episode
            : CACHE_INVALID_KEY_DO_NOT_USE,
        cacheStatusStorage,
    );
    const { colorValue } = useRawThemeValues();
    const { showActionSheet, showSpeedActionSheet, handleClose, handleSpeedClose, setShowSpeedActionSheet } =
        useActionSheetStore(state => ({
            showActionSheet: state.showActionSheet,
            showSpeedActionSheet: state.showSpeedActionSheet,
            handleClose: state.handleClose,
            handleSpeedClose: state.handleSpeedClose,
            setShowSpeedActionSheet: state.setShowSpeedActionSheet,
        }));
    const { speedValue, retainPitch, applySpeed } = usePlaybackSpeedStore(state => ({
        speedValue: state.speedValue,
        retainPitch: state.retainPitch,
        applySpeed: state.applySpeed,
    }));
    const { downloadList } = useDownloadStore(state => ({ downloadList: state.downloadList }));
    const currentItemDownload = downloadList.get(
        currentTrack?.extendedData?.id + "_" + currentTrack?.extendedData?.episode,
    );
    const currentProgress = currentItemDownload?.progress;

    const menuItems = [
        {
            show: true,
            disabled: false,
            icon: "fa6-solid:eye",
            iconSize: 16,
            text: "查看详情",
            action: () => {
                if (!currentTrack?.extendedData) {
                    return;
                }
                handleClose();
                if (!isInsidePage) {
                    useBottomSheetStore.getState().close();
                }
                setTimeout(
                    () => {
                        router.navigate(`/video/${currentTrack.extendedData?.id}`);
                    },
                    isInsidePage ? 0 : 250,
                );
            },
        },
        {
            show: true,
            disabled: false,
            icon: "fa6-solid:plus",
            iconSize: 18,
            text: "添加到歌单",
            action: () => {
                if (!currentTrack?.extendedData) {
                    return;
                }
                handleClose();
                console.log(isInsidePage);
                if (!isInsidePage) {
                    useBottomSheetStore.getState().close();
                }
                setTimeout(
                    () => {
                        openAddPlaylistPage({
                            name: currentTrack.title ?? "",
                            description: "",
                            playlistDetail: [
                                {
                                    author: currentTrack.artist ?? "",
                                    bvid: currentTrack.extendedData?.id ?? "",
                                    duration: currentTrack.duration ?? 0,
                                    episode: currentTrack.extendedData?.episode ?? 1,
                                    title: currentTrack.title ?? "",
                                    imgUrl: currentTrack.artworkUri ?? "",
                                    id: 0,
                                    playlistId: 0,
                                    extendedData: null,
                                },
                            ],
                            cover: currentTrack.artworkUri ?? "",
                        });
                    },
                    isInsidePage ? 0 : 250,
                );
            },
        },
        {
            show: Platform.OS !== "web" && !currentCache,
            disabled: !!currentItemDownload,
            icon: "fa6-solid:download",
            iconSize: 18,
            text: currentProgress
                ? `下载中 (${Math.round((currentProgress.totalBytesWritten / currentProgress.totalBytesExpectedToWrite) * 100 || 0)}%)`
                : "缓存到本地",
            action: async () => {
                if (!currentTrack?.extendedData) {
                    return;
                }
                await downloadResource(currentTrack.extendedData.id, currentTrack.extendedData.episode);
                if (!useActionSheetStore.getState().showActionSheet) {
                    Toast.show({
                        type: "success",
                        text1: "下载完成",
                        text2: currentTrack.title + "",
                    });
                }
            },
        },
        {
            show: Platform.OS === "web",
            disabled: false,
            icon: "fa6-solid:download",
            iconSize: 18,
            text: "下载",
            action: async () => {
                if (!currentTrack?.extendedData) {
                    return;
                }
                globalThis.window.open(
                    getBilisoundResourceUrlOnline(
                        currentTrack.extendedData.id,
                        currentTrack.extendedData.episode,
                        useSettingsStore.getState().useLegacyID ? "av" : "bv",
                    ).url,
                );
                handleClose();
            },
        },
        {
            show: Platform.OS !== "web" && currentCache,
            disabled: false,
            icon: "fa6-solid:floppy-disk",
            iconSize: 18,
            text: "保存到文件",
            action: async () => {
                if (!currentTrack?.extendedData) {
                    return;
                }
                handleClose();

                const fileName = `[${useSettingsStore.getState().useLegacyID ? bv2av(currentTrack.extendedData.id) : currentTrack.extendedData.id}] [P${currentTrack.extendedData.episode}] ${currentTrack.title}.m4a`;
                try {
                    await saveAudioFile(
                        uriToPath(
                            getCacheAudioPath(currentTrack.extendedData.id, currentTrack.extendedData.episode, false),
                        ),
                        fileName,
                    );
                    Toast.show({
                        type: "success",
                        text1: "文件已保存",
                        text2: fileName,
                    });
                } catch (error) {
                    log.error("文件未保存：" + error);
                }
            },
        },
        {
            show: true,
            disabled: false,
            icon: "material-symbols:speed-rounded",
            iconSize: 20,
            text: "调节播放速度",
            action: () => {
                handleClose();
                setShowSpeedActionSheet(true);
            },
        },
        {
            show: process.env.NODE_ENV === "development",
            disabled: false,
            icon: "fa6-solid:bug",
            iconSize: 18,
            text: "打印 currentTrack 到控制台",
            action: () => {
                console.log(JSON.stringify(currentTrack, null, 4));
            },
        },
        {
            show: true,
            disabled: false,
            icon: "fa6-solid:xmark",
            iconSize: 20,
            text: "取消",
            action: () => {
                handleClose();
            },
        },
    ];

    return (
        <>
            {/* 操作菜单 */}
            <Actionsheet isOpen={showActionSheet} onClose={handleClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    {!!currentTrack && (
                        <ActionSheetCurrent
                            line1={currentTrack.title ?? ""}
                            line2={formatSecond(currentTrack.duration ?? 0)}
                            image={currentTrack.artworkUri}
                        />
                    )}
                    {menuItems
                        .filter(e => e.show)
                        .map(item => (
                            <ActionsheetItem key={item.text} onPress={item.action} isDisabled={item.disabled}>
                                <View className={"size-6 items-center justify-center"}>
                                    <Monicon
                                        name={item.icon}
                                        size={item.iconSize}
                                        color={colorValue("--color-typography-700")}
                                    />
                                </View>
                                <ActionsheetItemText>{item.text}</ActionsheetItemText>
                            </ActionsheetItem>
                        ))}
                </ActionsheetContent>
            </Actionsheet>

            {/* 速度菜单 */}
            <Actionsheet isOpen={showSpeedActionSheet} onClose={handleSpeedClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <View className={"w-full px-2 pt-4 pb-6"}>
                        {/*<Text className={"font-semibold text-lg leading-tight"}>调节播放速度</Text>*/}
                        <SpeedControlPanel />
                        <View className="flex-row flex-wrap justify-center gap-2 mt-4">
                            {SPEED_PRESETS.map(item => (
                                <ButtonOuter key={item.text}>
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        onPress={() => {
                                            applySpeed(item.speed, retainPitch);
                                        }}
                                    >
                                        <ButtonText>{item.text}</ButtonText>
                                    </Button>
                                </ButtonOuter>
                            ))}
                        </View>
                        <Checkbox
                            size="md"
                            isInvalid={false}
                            isDisabled={false}
                            value={""}
                            isChecked={retainPitch}
                            onChange={e => {
                                applySpeed(speedValue, e);
                            }}
                            className={"mt-4"}
                        >
                            <CheckboxIndicator>
                                <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                            <CheckboxLabel className={"text-sm"}>变速不变调</CheckboxLabel>
                        </Checkbox>
                    </View>
                </ActionsheetContent>
            </Actionsheet>
        </>
    );
}

function SpeedControlPanel() {
    const { speedValue, retainPitch, applySpeed } = usePlaybackSpeedStore(state => ({
        speedValue: state.speedValue,
        retainPitch: state.retainPitch,
        applySpeed: state.applySpeed,
    }));

    return (
        <>
            <Text className={"font-semibold text-base text-center"}>{speedValue.toFixed(2) + "x"}</Text>
            <View className={"h-6 flex-row items-center gap-4 mt-4"}>
                <GSSlider
                    className={"flex-1"}
                    value={speedValue}
                    step={0.01}
                    minValue={0.5}
                    maxValue={2}
                    size="md"
                    orientation="horizontal"
                    isDisabled={false}
                    isReversed={false}
                    onChange={e => {
                        applySpeed(e, retainPitch);
                    }}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </GSSlider>
            </View>
        </>
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
                const minSize = Math.min(width, height);
                const target = minSize - (minSize >= 448 ? 128 : 64);
                // 抖动缓解措施
                if (target > 0) {
                    setImageSize(minSize - (minSize >= 448 ? 128 : 64));
                }
            }}
        >
            <View
                style={{ width: imageSize, height: imageSize, boxShadow: shadow["xl"] }}
                className={"rounded-2xl overflow-hidden"}
            >
                <Image source={convertToHTTPS(currentTrack?.artworkUri + "")} className={"size-full"}></Image>
            </View>
        </View>
    );
}

function PlayerQueueList() {
    const isInsidePage = useContext(InsidePageContext);
    const queue = useQueue();

    const FlashListComponent = isInsidePage ? FlashList : BottomSheetFlashList;

    async function handleJump(index: number) {
        await jump(index);
    }

    return (
        <View className={"pb-2 md:py-0 flex-1"}>
            <FlashListComponent
                estimatedItemSize={64}
                data={queue}
                className={"md:py-2.5"}
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
                        onRequestPlay={() => handleJump(index)}
                        onToggle={() => toggle()}
                    />
                )}
            />
        </View>
    );
}

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
