import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";
import { useStyles } from "react-native-unistyles";
import { v4 } from "uuid";

import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "~/api/bilisound";
import CommonLayout from "~/components/CommonLayout";
import SongItem from "~/components/SongItem";
import VideoMeta from "~/components/VideoMeta";
import VideoSkeleton from "~/components/VideoSkeleton";
import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
} from "~/components/ui/actionsheet";
import { Box } from "~/components/ui/box";
import { Fab } from "~/components/ui/fab";
import { Text } from "~/components/ui/text";
import { BILIBILI_VIDEO_URL_PREFIX } from "~/constants/network";
import { SCREEN_BREAKPOINTS } from "~/constants/style";
import useApplyPlaylistStore from "~/store/apply-playlist";
import useHistoryStore from "~/store/history";
import { addTrackToQueue } from "~/utils/download-service";
import log from "~/utils/logger";
import { formatSecond } from "~/utils/misc";
import { convertToHTTPS } from "~/utils/string";

type PageItem = GetBilisoundMetadataResponse["pages"][number];

const IconShare = createIcon(FontAwesome5, "share");

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
    const { theme } = useStyles();
    const textBasicColor = theme.colorTokens.foreground;

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose} style={{ zIndex: 999 }}>
            <ActionsheetBackdrop />
            <ActionsheetContent style={{ zIndex: 999, paddingBottom: edgeInsets.bottom }}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {!!displayTrack && (
                    <Box className="flex items-start w-full px-4 py-4 gap-1">
                        <Text className="font-bold" ellipsizeMode="tail" numberOfLines={1}>
                            {displayTrack.part}
                        </Text>
                        <Text className="text-sm opacity-60">{formatSecond(displayTrack.duration)}</Text>
                    </Box>
                )}
                <ActionsheetItem onPress={() => onAction("addPlaylist")}>
                    <Box
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Entypo name="add-to-list" size={20} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>添加到歌单</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("close")}>
                    <Box
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
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
    const { theme } = useStyles();
    const textBasicColor = theme.colorTokens.foreground;

    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PageItem | undefined>();

    const { width } = useWindowDimensions();

    // 添加歌单
    const { setPlaylistDetail, setName } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
    }));

    // 数据请求
    const { data, error, isLoading } = useQuery({
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
                        addTrackToQueue({
                            id: rootData.bvid,
                            episode: item.page,
                            artist: data!.data.owner.name,
                            artwork: data!.data.pic,
                            duration: item.duration,
                            title: item.part,
                        })
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
                        id: 0,
                        playlistId: 0,
                    }}
                />
            );
        },
        [data],
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
                <PotatoButtonTitleBar
                    label="在外部应用查看"
                    Icon={IconShare}
                    iconSize={18}
                    theme="solid"
                    onPress={async () => {
                        await Linking.openURL(`${BILIBILI_VIDEO_URL_PREFIX}${data?.data.bvid}`);
                    }}
                />
            }
        >
            {isLoading ? <VideoSkeleton /> : null}
            {error ? (
                <Box
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        opacity: 0.5,
                    }}
                >
                    <MaterialIcons name="error-outline" size={72} color={textBasicColor} />
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>查询失败了</Text>
                    <Text style={{ fontSize: 14 }}>{`${error?.message || error}`}</Text>
                </Box>
            ) : null}
            {data ? (
                <Box style={{ flex: 1, flexDirection: "row" }}>
                    {width >= SCREEN_BREAKPOINTS.md ? (
                        <Box style={{ flex: 0, flexBasis: "auto", width: 384 }}>
                            <ScrollView>
                                <VideoMeta meta={data.data} />
                                <Box style={{ height: edgeInsets.bottom }} />
                            </ScrollView>
                        </Box>
                    ) : null}
                    <Box style={{ flex: 1 }}>
                        <FlashList
                            data={dataList}
                            extraData={updateTriggerString}
                            keyExtractor={item => `${item.page}`}
                            ListHeaderComponent={
                                width < SCREEN_BREAKPOINTS.md ? (
                                    <VideoMeta meta={data.data} />
                                ) : (
                                    <Box className="h-12" />
                                )
                            }
                            ListFooterComponent={
                                <View style={{ height: edgeInsets.bottom + (activeTrack ? 58 + 36 : 12) }} />
                            }
                            renderItem={renderItem}
                            estimatedItemSize={dataLength * 64}
                        />
                    </Box>
                </Box>
            ) : null}
            {activeTrack ? (
                <Fab
                    size="lg"
                    isHovered={false}
                    isDisabled={false}
                    isPressed={false}
                    style={{
                        right: edgeInsets.right + 24,
                        bottom: edgeInsets.bottom + 24,
                    }}
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
                                    id: 0,
                                    playlistId: 0,
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
