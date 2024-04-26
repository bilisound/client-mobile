import { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    Box,
    Button,
    ButtonText,
    Pressable,
    Text,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import { remove } from "react-native-track-player/src/trackPlayer";

import CommonLayout from "../../components/CommonLayout";
import EditAction from "../../components/EditAction";
import SongItem from "../../components/SongItem";
import { COMMON_FRAME_BUTTON_STYLE } from "../../constants/style";
import useCommonColors from "../../hooks/useCommonColors";
import useMultiSelect from "../../hooks/useMultiSelect";
import useTracks from "../../hooks/useTracks";
import { invalidateOnQueueStatus, PLAYLIST_ON_QUEUE, PlaylistDetailRow, playlistStorage } from "../../storage/playlist";
import useSettingsStore from "../../store/settings";
import { getFileName } from "../../utils/format";
import log from "../../utils/logger";
import { saveFile } from "../../utils/misc";
import { tracksToPlaylist } from "../../utils/track-data";

const iconWrapperStyle = {
    w: 24,
    h: 24,
    alignItems: "center",
    justifyContent: "center",
};

interface LongPressActionsProps {
    showActionSheet: boolean;
    displayTrack?: PlaylistDetailRow | null;
    onClose: () => void;
    onAction: (action: "delete" | "export" | "close") => void;
}

function LongPressActionsRaw({ showActionSheet, displayTrack, onAction, onClose }: LongPressActionsProps) {
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent zIndex={999} pb={edgeInsets.bottom}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {displayTrack ? (
                    <Pressable
                        w="100%"
                        px="$5"
                        py="$2"
                        my="$2"
                        flexDirection="row"
                        gap="$4"
                        onPress={() => {
                            router.push(`/query/${displayTrack?.bvid}`);
                            onAction("close");
                        }}
                    >
                        <Image
                            source={displayTrack.imgUrl}
                            style={{
                                height: 48,
                                aspectRatio: "16/9",
                                flex: 0,
                                borderRadius: 8,
                            }}
                        />
                        <Box flex={1} gap="$1">
                            <Text numberOfLines={1} ellipsizeMode="tail" fontSize={16} fontWeight="700">
                                {displayTrack.title}
                            </Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" fontSize={14} opacity={0.7}>
                                {displayTrack.author}
                            </Text>
                        </Box>
                    </Pressable>
                ) : null}
                <ActionsheetItem onPress={() => onAction("delete")}>
                    <Box sx={iconWrapperStyle}>
                        <MaterialIcons name="delete" size={24} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>从播放列表删除</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("export")}>
                    <Box sx={iconWrapperStyle}>
                        <Ionicons name="save" size={18} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>导出音频文件</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("close")}>
                    <Box sx={iconWrapperStyle}>
                        <MaterialIcons name="cancel" size={22} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>取消</ActionsheetItemText>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    );
}

const LongPressActions = memo(LongPressActionsRaw);

const TabPlaying: React.FC = () => {
    const { primaryColor } = useCommonColors();
    const { tracks, update } = useTracks();
    const { useLegacyID } = useSettingsStore(state => ({
        useLegacyID: state.useLegacyID,
    }));

    // 多选管理
    const { clear, toggle, selected, setAll, reverse } = useMultiSelect<number>();
    const [editing, setEditing] = useState(false);

    // 菜单操作
    const currentOperateIndex = useRef(-1);
    const [showActionSheet, setShowActionSheet] = React.useState(false);
    const [displayTrack, setDisplayTrack] = useState<PlaylistDetailRow | null>(null);

    const handleClose = () => setShowActionSheet(prevState => !prevState);

    const handleDeleteSingle = useCallback(async () => {
        await remove(currentOperateIndex.current);
        await update();
        invalidateOnQueueStatus();
        handleClose();
    }, [update]);

    const handleExport = useCallback(async () => {
        const track = await TrackPlayer.getTrack(currentOperateIndex.current);
        if (!track) {
            log.error(
                `导出失败，参数异常。track: ${track}, currentOperateIndex.current: ${currentOperateIndex.current}`,
            );
            return;
        }
        const done = await saveFile(
            track.url,
            getFileName({
                av: useLegacyID,
                episode: track.bilisoundEpisode ?? "",
                id: track.bilisoundId ?? "",
                title: track.title ?? "",
            }),
        );
        if (done) {
            handleClose();
        }
    }, [useLegacyID]);

    // 列表删除
    const handleDelete = useCallback(async () => {
        await TrackPlayer.remove(Array.from(selected));
        await update();
        clear();
        if ((await TrackPlayer.getQueue()).length <= 0) {
            setEditing(false);
        }
        invalidateOnQueueStatus();
    }, [clear, selected, update]);

    // 转换后的列表
    const convertedTrack = useMemo(() => tracksToPlaylist(tracks), [tracks]);

    return (
        <CommonLayout
            title="正在播放"
            titleBarTheme="transparent"
            extendToBottom
            rightAccessories={
                tracks.length > 0 ? (
                    <Pressable
                        sx={COMMON_FRAME_BUTTON_STYLE}
                        onPress={() => {
                            setEditing(prevState => {
                                if (prevState) {
                                    clear();
                                }
                                return !prevState;
                            });
                        }}
                    >
                        {editing ? (
                            <Entypo name="check" size={24} color={primaryColor} />
                        ) : (
                            <MaterialCommunityIcons name="format-list-checks" size={24} color={primaryColor} />
                        )}
                    </Pressable>
                ) : null
            }
        >
            {/* 菜单项目 */}
            {tracks.length > 0 ? (
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
                                onToggle={() => {
                                    toggle(item.index);
                                }}
                                onLongPress={() => {
                                    setDisplayTrack(item.item);
                                    setShowActionSheet(true);
                                }}
                                isChecking={editing}
                                isChecked={selected.has(item.index)}
                            />
                        );
                    }}
                    data={convertedTrack}
                    estimatedItemSize={68}
                    extraData={[editing, selected.size]}
                />
            ) : (
                <Box
                    sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        flexGrow: 1,
                        gap: 16,
                    }}
                >
                    <Text
                        sx={{
                            fontSize: 14,
                            opacity: 0.5,
                        }}
                    >
                        这里空空如也
                    </Text>
                    <Button action="primary" onPress={() => router.push("/(tabs)")}>
                        <ButtonText>去查询</ButtonText>
                    </Button>
                </Box>
            )}

            {/* 操作菜单 */}
            <LongPressActions
                showActionSheet={showActionSheet}
                onClose={handleClose}
                displayTrack={displayTrack}
                onAction={action => {
                    switch (action) {
                        case "delete":
                            handleDeleteSingle();
                            break;
                        case "export":
                            handleExport();
                            break;
                        case "close":
                            handleClose();
                            break;
                        default:
                            break;
                    }
                }}
            />

            {editing ? (
                <EditAction
                    onAll={() => {
                        setAll(new Array(tracks.length).fill(0).map((_, i) => i));
                    }}
                    onReverse={() => {
                        reverse(new Array(tracks.length).fill(0).map((_, i) => i));
                    }}
                    onDelete={() => {
                        handleDelete();
                    }}
                    amount={selected.size}
                />
            ) : null}
        </CommonLayout>
    );
};

export default TabPlaying;
