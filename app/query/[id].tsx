import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    Box,
    Fab,
    Pressable,
    Text,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { v4 } from "uuid";

import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "../../api/bilisound";
import CommonLayout from "../../components/CommonLayout";
import ProgressBar from "../../components/ProgressBar";
import VideoMeta from "../../components/VideoMeta";
import VideoSkeleton from "../../components/VideoSkeleton";
import { BILIBILI_VIDEO_URL_PREFIX } from "../../constants/network";
import { COMMON_FRAME_SOLID_BUTTON_STYLE, COMMON_TOUCH_COLOR, SCREEN_BREAKPOINTS } from "../../constants/style";
import useCommonColors from "../../hooks/useCommonColors";
import useAddPlaylistStore from "../../store/addPlaylist";
import useHistoryStore from "../../store/history";
import usePlayerStateStore from "../../store/playerState";
import log from "../../utils/logger";
import { formatSecond } from "../../utils/misc";
import { handleTogglePlay } from "../../utils/player-control";
import { convertToHTTPS } from "../../utils/string";

type PageItem = GetBilisoundMetadataResponse["pages"][number];

// 播放状态图标
function PlayingIcon() {
    const playingState = usePlaybackState().state;
    const activeTrack = useActiveTrack();
    const isPlaying = playingState === State.Playing;
    const { accentColor } = useCommonColors();

    if (!activeTrack?.bilisoundIsLoaded) {
        return <ActivityIndicator color={accentColor} />;
    }

    return <FontAwesome5 name={isPlaying ? "pause" : "play"} size={20} color={accentColor} />;
}

interface ListEntryProps {
    isActiveTrack: boolean;
    isDownloaded: boolean;
    onRequestPlay: () => void;
    onLongPress: () => void;
    belongId: string;
    item: PageItem;
}

// 列表项目
const ListEntryRaw: React.FC<ListEntryProps> = ({
    isActiveTrack,
    isDownloaded,
    onRequestPlay,
    onLongPress,
    belongId,
    item,
}) => {
    const { width } = useWindowDimensions();
    const { textBasicColor } = useCommonColors();

    return (
        <Pressable
            sx={COMMON_TOUCH_COLOR}
            onPress={async () => {
                if (isActiveTrack) {
                    await handleTogglePlay();
                    return;
                }
                onRequestPlay();
            }}
            onLongPress={onLongPress}
        >
            <Box
                sx={{
                    paddingHorizontal: width >= SCREEN_BREAKPOINTS.md ? 24 : 16,
                    height: 64,
                    flexDirection: "row",
                    gap: 10,
                    position: "relative",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        flexDirection: "row",
                        flex: 1,
                        gap: 10,
                        justifyContent: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: isActiveTrack ? "$accent500" : "$primary500",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 6,
                            paddingRight: 6,
                            height: 22,
                            borderRadius: 6,
                            flex: 0,
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "$white",
                            }}
                        >
                            {item.page}
                        </Text>
                    </Box>
                    <Box flex={1}>
                        <Text
                            sx={{
                                lineHeight: 22,
                                fontSize: 14,
                                fontWeight: isActiveTrack ? "700" : "400",
                                color: isActiveTrack ? "$accent500" : textBasicColor,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.part}
                        </Text>
                        <Box
                            sx={{
                                marginTop: 4,
                                gap: 4,
                                flexDirection: "row",
                                alignItems: "center",
                                opacity: 0.5,
                            }}
                        >
                            {isDownloaded ? (
                                <Ionicons name="checkmark-circle" size={14} color={textBasicColor} />
                            ) : null}
                            <Text
                                sx={{
                                    fontSize: 14,
                                }}
                            >
                                {formatSecond(item.duration)}
                            </Text>
                        </Box>
                    </Box>
                </Box>
                {isActiveTrack ? (
                    <>
                        <Box
                            sx={{
                                flex: 0,
                                alignItems: "center",
                                justifyContent: "center",
                                width: 32,
                            }}
                        >
                            <PlayingIcon />
                        </Box>
                        <ProgressBar item={`${belongId}_${item.page}`} />
                    </>
                ) : null}
            </Box>
        </Pressable>
    );
};

const ListEntry = memo(ListEntryRaw, (a, b) => {
    return (
        a.isActiveTrack === b.isActiveTrack &&
        a.isDownloaded === b.isDownloaded &&
        a.item === b.item &&
        a.belongId === b.belongId
    );
});

const iconWrapperStyle = {
    w: 24,
    h: 24,
    alignItems: "center",
    justifyContent: "center",
};

interface LongPressActionsProps {
    showActionSheet: boolean;
    displayTrack?: PageItem;
    onClose: () => void;
    onAction: (action: "addPlaylist" | "addPlaylistRecent" | "close") => void;
}

/**
 * 长按操作
 */
function LongPressActions({ showActionSheet, displayTrack, onAction, onClose }: LongPressActionsProps) {
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent zIndex={999} pb={edgeInsets.bottom}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {!!displayTrack && (
                    <Box alignItems="flex-start" w="100%" px="$4" py="$4" gap="$1">
                        <Text fontWeight="700" ellipsizeMode="tail" numberOfLines={1}>
                            {displayTrack.part}
                        </Text>
                        <Text fontSize="$sm" opacity={0.6}>
                            {formatSecond(displayTrack.duration)}
                        </Text>
                    </Box>
                )}
                <ActionsheetItem onPress={() => onAction("addPlaylist")}>
                    <Box sx={iconWrapperStyle}>
                        <Entypo name="add-to-list" size={20} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>添加到歌单</ActionsheetItemText>
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

const QueryIdScreen: React.FC = () => {
    const { id, noHistory } = useLocalSearchParams<{ id: string; noHistory?: string }>();
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();

    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PageItem | undefined>();

    // 添加播放列表
    const { setPlaylistDetail } = useAddPlaylistStore(state => ({ setPlaylistDetail: state.setPlaylistDetail }));

    // 数据请求
    const { data, error } = useQuery({
        queryKey: [id],
        queryFn: () => getBilisoundMetadata({ id }),
    });

    // 增加历史记录条目
    const { appendHistoryList } = useHistoryStore(state => ({
        appendHistoryList: state.appendHistoryList,
    }));

    // 关闭菜单操作
    const handleClose = () => {
        setShowActionSheet(false);
    };

    useEffect(() => {
        if (data && !noHistory) {
            appendHistoryList({
                authorName: data.data.owner.name,
                id: data.data.bvid,
                name: data.data.title,
                thumbnailUrl: convertToHTTPS(data.data.pic),
                visitedAt: new Date(),
                key: v4(),
            });
        }
    }, [appendHistoryList, data, noHistory]);

    // 播放列表
    const activeTrack = useActiveTrack();

    // 播放状态
    const { setPlayingRequest, playingRequest } = usePlayerStateStore(state => ({
        setPlayingRequest: state.setPlayingRequest,
        playingRequest: state.playingRequest,
    }));

    // 播放列表渲染
    const renderItem = useCallback(
        ({ item }: { item: PageItem }) => {
            const rootData = data!.data;
            const isActiveTrack =
                activeTrack?.bilisoundId === rootData.bvid && activeTrack?.bilisoundEpisode === item.page;

            return (
                <ListEntry
                    isDownloaded={false}
                    isActiveTrack={isActiveTrack}
                    belongId={rootData.bvid}
                    onRequestPlay={() => {
                        setPlayingRequest({
                            id: rootData.bvid,
                            episode: item.page,
                            artist: data!.data.owner.name,
                            artwork: data!.data.pic,
                            duration: item.duration,
                            title: item.part,
                        });
                    }}
                    onLongPress={() => {
                        setDisplayTrack(item);
                        setShowActionSheet(true);
                    }}
                    item={item}
                />
            );
        },
        [activeTrack, data, setPlayingRequest],
    );

    const dataList = data?.data.pages ?? [];
    const dataLength = Math.max(dataList.length, 1);
    const activeTrackString = `${activeTrack?.bilisoundId}__${activeTrack?.bilisoundEpisode}`;
    const requestTrackString = `${playingRequest?.id}__${playingRequest?.episode}`;
    const updateTriggerString = `${activeTrackString}__${requestTrackString}__${!!activeTrack}`;

    return (
        <CommonLayout
            title="查看详情"
            extendToBottom
            leftAccessories="backButton"
            rightAccessories={
                <Pressable
                    sx={COMMON_FRAME_SOLID_BUTTON_STYLE}
                    onPress={async () => {
                        await Linking.openURL(`${BILIBILI_VIDEO_URL_PREFIX}${data?.data.bvid}`);
                    }}
                >
                    <FontAwesome5 name="share" size={16} color="#fff" />
                </Pressable>
            }
        >
            {error ? (
                <Box
                    sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        opacity: 0.5,
                    }}
                >
                    <MaterialIcons name="error-outline" size={72} color={textBasicColor} />
                    <Text sx={{ fontSize: 20, fontWeight: "700" }}>查询失败了</Text>
                    <Text sx={{ fontSize: 14 }}>{`${error?.message || error}`}</Text>
                </Box>
            ) : (
                <FlashList
                    data={dataList}
                    extraData={updateTriggerString}
                    keyExtractor={item => `${item.page}`}
                    ListHeaderComponent={data ? <VideoMeta meta={data.data} /> : <View />}
                    ListFooterComponent={<View style={{ height: edgeInsets.bottom + (activeTrack ? 58 + 36 : 0) }} />}
                    renderItem={renderItem}
                    estimatedItemSize={dataLength * 64}
                    ListEmptyComponent={<VideoSkeleton />}
                />
            )}
            {activeTrack ? (
                <Fab
                    size="lg"
                    isHovered={false}
                    isDisabled={false}
                    isPressed={false}
                    right={edgeInsets.right + 24}
                    bottom={edgeInsets.bottom + 24}
                    onPress={() => router.push("/modal")}
                >
                    <FontAwesome5 name="headphones" size={24} color="#fff" />
                </Fab>
            ) : null}
            <LongPressActions
                showActionSheet={showActionSheet}
                onClose={handleClose}
                onAction={action => {
                    handleClose();
                    if (!displayTrack) {
                        log.error("/query/[id]", `用户在没有指定操作目标的情况下，执行了菜单操作 ${action}`);
                        return;
                    }
                    switch (action) {
                        case "addPlaylist":
                            router.push(`/apply-playlist`);
                            setPlaylistDetail([
                                {
                                    author: data?.data.owner.name ?? "",
                                    bvid: data?.data.bvid ?? "",
                                    duration: displayTrack.duration,
                                    episode: displayTrack.page,
                                    title: displayTrack.part,
                                    imgUrl: data?.data.pic ?? "",
                                },
                            ]);
                            break;
                        case "close":
                            break;
                    }
                }}
                displayTrack={displayTrack}
            />
        </CommonLayout>
    );
};

export default QueryIdScreen;
