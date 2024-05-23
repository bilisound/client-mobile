import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
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
    useToast,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";
import { v4 } from "uuid";

import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "~/api/bilisound";
import CommonLayout from "~/components/CommonLayout";
import SongItem from "~/components/SongItem";
import VideoMeta from "~/components/VideoMeta";
import VideoSkeleton from "~/components/VideoSkeleton";
import { BILIBILI_VIDEO_URL_PREFIX } from "~/constants/network";
import { COMMON_FRAME_SOLID_BUTTON_STYLE } from "~/constants/style";
import useCommonColors from "~/hooks/useCommonColors";
import useToastContainerStyle from "~/hooks/useToastContainerStyle";
import useAddPlaylistStore from "~/store/addPlaylist";
import useHistoryStore from "~/store/history";
import { addTrackToQueue } from "~/utils/download-service";
import log from "~/utils/logger";
import { formatSecond } from "~/utils/misc";
import { convertToHTTPS } from "~/utils/string";

type PageItem = GetBilisoundMetadataResponse["pages"][number];

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
    const toast = useToast();
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();
    const containerStyle = useToastContainerStyle();

    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PageItem | undefined>();

    // 添加歌单
    const { setPlaylistDetail, setName } = useAddPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
    }));

    // 数据请求
    const { data, error } = useQuery({
        queryKey: [id],
        queryFn: () => {
            if (!id) {
                return undefined;
            }
            return getBilisoundMetadata({ id });
        },
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

    // 歌单
    const activeTrack = useActiveTrack();

    // 歌单渲染
    const renderItem = useCallback(
        ({ item }: { item: PageItem }) => {
            const rootData = data!.data;

            return (
                <SongItem
                    onRequestPlay={() =>
                        addTrackToQueue(
                            {
                                id: rootData.bvid,
                                episode: item.page,
                                artist: data!.data.owner.name,
                                artwork: data!.data.pic,
                                duration: item.duration,
                                title: item.part,
                            },
                            { toast, containerStyle },
                        )
                    }
                    onLongPress={() => {
                        setDisplayTrack(item);
                        setShowActionSheet(true);
                    }}
                    data={{
                        author: data!.data.owner.name,
                        bvid: rootData.bvid,
                        duration: item.duration,
                        episode: item.page,
                        title: item.part,
                        imgUrl: data!.data.pic,
                    }}
                />
            );
        },
        [containerStyle, data, toast],
    );

    const dataList = data?.data.pages ?? [];
    const dataLength = Math.max(dataList.length, 1);
    const activeTrackString = `${activeTrack?.bilisoundId}__${activeTrack?.bilisoundEpisode}`;
    const updateTriggerString = `${activeTrackString}__${!!activeTrack}`;

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
                            setName(data?.data.title ?? "");
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
