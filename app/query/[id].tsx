import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";
import { v4 } from "uuid";

import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "~/api/bilisound";
import CommonLayout from "~/components/CommonLayout";
import SongItem from "~/components/SongItem";
import VideoMeta from "~/components/VideoMeta";
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
import { Fab } from "~/components/ui/fab";
import { Text } from "~/components/ui/text";
import { BILIBILI_VIDEO_URL_PREFIX } from "~/constants/network";
import useApplyPlaylistStore from "~/store/apply-playlist";
import useHistoryStore from "~/store/history";
import { formatSecond } from "~/utils/datetime";
import { addTrackToQueue } from "~/utils/download-service";
import log from "~/utils/logger";
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

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose} style={{ zIndex: 999 }}>
            <ActionsheetBackdrop />
            <ActionsheetContent style={{ zIndex: 999, paddingBottom: edgeInsets.bottom }}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {!!displayTrack && (
                    <View className="flex items-start w-full px-4 py-4 gap-1">
                        <Text className="font-bold" isTruncated>
                            {displayTrack.part}
                        </Text>
                        <Text className="text-sm opacity-60">{formatSecond(displayTrack.duration)}</Text>
                    </View>
                )}
                <ActionsheetItem onPress={() => onAction("addPlaylist")}>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Entypo name="add-to-list" size={20} className="color-typography-700" />
                    </View>
                    <ActionsheetItemText>添加到歌单</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("close")}>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MaterialIcons name="cancel" size={22} className="color-typography-700" />
                    </View>
                    <ActionsheetItemText>取消</ActionsheetItemText>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    );
}

export default function Page() {
    const { id, noHistory } = useLocalSearchParams<{ id: string; noHistory?: string }>();
    const edgeInsets = useSafeAreaInsets();

    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PageItem | undefined>();

    // 添加歌单
    const { setPlaylistDetail, setName, setDescription, setSource, setCover } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
        setDescription: state.setDescription,
        setSource: state.setSource,
        setCover: state.setCover,
    }));

    // 数据请求
    const { isLoading, data, error } = useQuery({
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
                        extendedData: null,
                    }}
                />
            );
        },
        [data],
    );

    const dataList = data?.data.pages ?? [];

    return (
        <CommonLayout
            title="查看详情"
            overrideEdgeInsets={{
                bottom: 0,
            }}
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
            {isLoading ? (
                <View className="flex-1 flex-col sm:flex-row">
                    <View className="hidden sm:flex flex-1 w-full">
                        <ScrollView>
                            <VideoMeta skeleton />
                        </ScrollView>
                    </View>
                    <View className="flex-1">
                        <VideoMeta className="flex sm:hidden" skeleton />
                    </View>
                </View>
            ) : null}
            {error ? (
                <View className="flex-1 items-center justify-center gap-3 opacity-50">
                    <MaterialIcons name="error-outline" size={72} className="color-typography-700" />
                    <Text className="text-[1.25rem] font-semibold text-typography-700">查询失败了</Text>
                    <Text className="text-sm text-typography-700">{`${error?.message || error}`}</Text>
                </View>
            ) : null}
            {data ? (
                <View className="hidden sm:flex flex-1 flex-row">
                    <View className="flex-1 w-full">
                        <ScrollView>
                            <VideoMeta meta={data.data} />
                            <View style={{ height: edgeInsets.bottom }} />
                        </ScrollView>
                    </View>
                    <View className="flex-1">
                        <FlashList
                            data={dataList}
                            keyExtractor={item => `${item.page}`}
                            ListHeaderComponent={
                                <>
                                    <View className="h-3" aria-hidden />
                                </>
                            }
                            ListFooterComponent={
                                <View style={{ height: edgeInsets.bottom + (activeTrack ? 58 + 36 : 12) }} />
                            }
                            renderItem={renderItem}
                            estimatedItemSize={82}
                        />
                    </View>
                </View>
            ) : null}
            {data ? (
                <View className="flex sm:hidden flex-1">
                    <FlashList
                        data={dataList}
                        keyExtractor={item => `${item.page}`}
                        ListHeaderComponent={
                            <>
                                <VideoMeta meta={data.data} className="" />
                            </>
                        }
                        ListFooterComponent={
                            <View style={{ height: edgeInsets.bottom + (activeTrack ? 58 + 36 : 12) }} />
                        }
                        renderItem={renderItem}
                        estimatedItemSize={82}
                    />
                </View>
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
                            setName(data?.data.title ?? "");
                            setDescription(data?.data.desc ?? "");
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
                                    extendedData: null,
                                },
                            ]);
                            setSource();
                            setCover();
                            router.push(`/apply-playlist`);
                            break;
                        case "close":
                            break;
                    }
                }}
                displayTrack={displayTrack}
            />
        </CommonLayout>
    );
}
