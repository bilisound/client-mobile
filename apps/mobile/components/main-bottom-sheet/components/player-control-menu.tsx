import React, { useContext } from "react";
import { InsidePageContext } from "~/components/main-bottom-sheet/utils";
import { useCurrentTrack } from "@bilisound/player";
import { useMMKVBoolean } from "react-native-mmkv";
import { CACHE_INVALID_KEY_DO_NOT_USE, cacheStatusStorage } from "~/storage/cache-status";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { useActionSheetStore } from "~/components/main-bottom-sheet/stores";
import { usePlaybackSpeedStore } from "~/store/playback-speed";
import useDownloadStore from "~/store/download";
import { useBottomSheetStore } from "~/store/bottom-sheet";
import { router } from "expo-router";
import { openAddPlaylistPage } from "~/business/playlist/misc";
import { Platform, View } from "react-native";
import { downloadResource } from "~/business/download";
import Toast from "react-native-toast-message";
import { getBilisoundResourceUrlOnline } from "~/api/bilisound";
import useSettingsStore from "~/store/settings";
import { bv2av } from "~/utils/vendors/av-bv";
import { getCacheAudioPath, saveAudioFile, uriToPath } from "~/utils/file";
import log from "~/utils/logger";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
} from "~/components/ui/actionsheet";
import { ActionSheetCurrent } from "~/components/action-sheet-current";
import { formatSecond } from "~/utils/datetime";
import { Monicon } from "@monicon/native";
import { SPEED_PRESETS } from "~/components/main-bottom-sheet/constants";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "~/components/ui/checkbox";
import { CheckIcon } from "~/components/ui/icon";
import { SpeedControlPanel } from "./speed-control-panel";
import { getImageProxyUrl } from "~/business/constant-helper";

export function PlayerControlMenu() {
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
