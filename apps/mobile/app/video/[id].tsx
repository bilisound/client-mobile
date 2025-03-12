import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import { convertToHTTPS } from "~/utils/string";
import { v4 } from "uuid";
import React, { useEffect, useState } from "react";
import useHistoryStore from "~/store/history";
import { getBilisoundMetadata } from "~/api/bilisound";
import { useQuery } from "@tanstack/react-query";
import { View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "~/components/ui/skeleton";
import { getImageProxyUrl } from "~/business/constant-helper";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDate, formatSecond } from "~/utils/datetime";
import { FlashList } from "@shopify/flash-list";
import { SongItem } from "~/components/song-item";
import { SkeletonText } from "~/components/skeleton-text";
import { Pressable } from "~/components/ui/pressable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { decodeHTML } from "entities";
import { addTrackFromDetail } from "~/business/playlist/handler";
import { Button, ButtonMonIcon, ButtonOuter, ButtonText } from "~/components/ui/button";
import { ErrorContent } from "~/components/error-content";
import { DualScrollView } from "~/components/dual-scroll-view";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
} from "~/components/ui/actionsheet";
import log from "~/utils/logger";
import { GetMetadataResponse } from "@bilisound/sdk";
import { openAddPlaylistPage } from "~/business/playlist/misc";
import { Monicon } from "@monicon/native";
import { Box } from "~/components/ui/box";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { ActionSheetCurrent } from "~/components/action-sheet-current";
import { ActionMenu, ActionMenuItem } from "~/components/action-menu";
import { useDownloadMenuItem } from "~/hooks/useDownloadMenuItem";
import { undefined } from "zod";

type PageItem = GetMetadataResponse["pages"][number];

interface LongPressActionsProps {
    showActionSheet: boolean;
    displayTrack: PageItem;
    onClose: () => void;
    onAction: (action: "addPlaylist" | "addPlaylistRecent" | "close") => void;
    data: GetMetadataResponse;
}

/**
 * 长按操作
 */
function LongPressActions({ showActionSheet, displayTrack, onAction, onClose, data }: LongPressActionsProps) {
    const { colorValue } = useRawThemeValues();

    const menuItems: ActionMenuItem[] = [
        ...useDownloadMenuItem(
            {
                title: displayTrack.part,
                artist: data.owner.name ?? "",
                artworkUri: data.pic ?? "",
                duration: displayTrack.duration ?? 0,
                extendedData: {
                    id: data.bvid,
                    episode: displayTrack.page,

                    // 以下为虚拟值
                    isLoaded: false,
                    expireAt: 0,
                    artworkUrl: data.pic,
                },
                headers: {},
                id: "",
                mimeType: "",
                uri: "",
            },
            () => onClose(),
        ),
    ];

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose} style={{ zIndex: 999 }}>
            <ActionsheetBackdrop />
            <ActionsheetContent style={{ zIndex: 999 }}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {displayTrack && data && (
                    <ActionSheetCurrent
                        line1={displayTrack.part}
                        line2={formatSecond(displayTrack.duration)}
                        image={getImageProxyUrl(data.pic, "https://www.bilibili.com/video/" + data.bvid)}
                    />
                )}
                <ActionMenu menuItems={menuItems} />
                <ActionsheetItem onPress={() => onAction("addPlaylist")}>
                    <Box className={"size-6 items-center justify-center"}>
                        <Monicon name={"fa6-solid:plus"} size={16} color={colorValue("--color-typography-700")} />
                    </Box>
                    <ActionsheetItemText>添加到歌单</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("close")}>
                    <View className={"size-6 items-center justify-center"}>
                        <Monicon name={"fa6-solid:xmark"} size={20} color={colorValue("--color-typography-700")} />
                    </View>
                    <ActionsheetItemText>取消</ActionsheetItemText>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    );
}

interface MetaDataProps {
    data?: GetMetadataResponse;
    className?: string;
    style?: ViewStyle;
    showFullMeta?: boolean;
}

function MetaData({ data, className, style, showFullMeta }: MetaDataProps) {
    const [alwaysShowFullMeta, setAlwaysShowFullMeta] = useState(false);

    function handleCreatePlaylist() {
        const meta = data;
        if (!meta) {
            log.error("使用 handleCreatePlaylist 函数时，meta 没有准备就绪！");
            return;
        }
        openAddPlaylistPage({
            playlistDetail: meta.pages.map(e => ({
                author: meta.owner.name ?? "",
                bvid: meta.bvid ?? "",
                duration: e.duration,
                episode: e.page,
                title: e.part,
                imgUrl: meta.pic ?? "",
                id: 0,
                playlistId: 0,
                extendedData: null,
            })),
            name: meta.title,
            description: meta.desc,
            source: {
                type: "video",
                bvid: meta.bvid,
                originalTitle: meta.title,
                lastSyncAt: new Date().getTime(),
            },
            cover: meta.pic,
        });
    }

    return (
        <View className={twMerge("gap-4", className)} style={style}>
            {data ? (
                <Image
                    source={getImageProxyUrl(data.pic, "https://www.bilibili.com/video/" + data.bvid)}
                    className="aspect-[16/9] rounded-lg"
                />
            ) : (
                <Skeleton className="aspect-[16/9] rounded-lg w-[unset] h-[unset]" />
            )}
            <View>
                {data ? (
                    <Text className="text-base font-bold mb-4 leading-6 text-typography-700" selectable>
                        {data.title}
                    </Text>
                ) : (
                    <View className="gap-2 py-1 mb-4">
                        <Skeleton className="rounded-full h-4 w-full" />
                        <Skeleton className="rounded-full h-4 w-1/2" />
                    </View>
                )}
                <View className="flex-row items-center gap-3 mb-4">
                    {data ? (
                        <>
                            <Image
                                source={getImageProxyUrl(
                                    data.owner.face,
                                    "https://www.bilibili.com/video/" + data.bvid,
                                )}
                                className="w-9 h-9 rounded-full aspect-square flex-shrink-0"
                            />
                            <Text className="flex-grow text-sm font-bold text-typography-700" isTruncated>
                                {data.owner.name}
                            </Text>
                            <Text className="flex-shrink-0 text-sm opacity-50 text-typography-700">
                                {formatDate(data.pubDate, "yyyy-MM-dd")}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Skeleton className="w-9 h-9 relative flex-shrink-0 rounded-full" />
                            <View className="flex-grow">
                                <Skeleton className="rounded-full w-20 h-[14px]" />
                            </View>
                            <Skeleton className="rounded-full flex-shrink-0 w-24 h-[14px]" />
                        </>
                    )}
                </View>
                {data ? (
                    <>
                        {alwaysShowFullMeta || showFullMeta ? (
                            <Text className={"text-sm leading-normal break-words"} selectable>
                                {decodeHTML(data.desc)}
                            </Text>
                        ) : (
                            <Pressable onPress={() => setAlwaysShowFullMeta(true)}>
                                <Text className={"text-sm leading-normal break-words line-clamp-6"}>
                                    {decodeHTML(data.desc)}
                                </Text>
                            </Pressable>
                        )}
                    </>
                ) : (
                    <SkeletonText lineSize={6} fontSize={14} lineHeight={21} />
                )}
                <View className={"mt-4 flex-row flex-wrap gap-2"}>
                    {data ? (
                        <>
                            {/* todo 区分单分 P（本页操作）和多分 P（新开页操作），实现不同的下载逻辑 */}
                            {process.env.NODE_ENV === "development" ? (
                                <ButtonOuter className={"rounded-full"}>
                                    <Button className={"rounded-full"} onPress={() => {}}>
                                        <ButtonMonIcon name={"fa6-solid:download"} size={16} />
                                        <ButtonText>下载</ButtonText>
                                    </Button>
                                </ButtonOuter>
                            ) : null}
                            <ButtonOuter className={"rounded-full"}>
                                <Button className={"rounded-full"} onPress={handleCreatePlaylist}>
                                    <ButtonMonIcon name={"fa6-solid:plus"} size={18} />
                                    <ButtonText>创建歌单</ButtonText>
                                </Button>
                            </ButtonOuter>
                            {data?.seasonId ? (
                                <ButtonOuter className={"rounded-full"}>
                                    <Button
                                        className={"rounded-full"}
                                        variant={"outline"}
                                        onPress={() => {
                                            router.navigate(
                                                `/remote-list?userId=${data?.owner.mid}&listId=${data?.seasonId}&mode=season`,
                                            );
                                        }}
                                    >
                                        <ButtonMonIcon name={"fa6-solid:list"} size={16} />
                                        <ButtonText>查看所属合集</ButtonText>
                                    </Button>
                                </ButtonOuter>
                            ) : null}
                        </>
                    ) : (
                        <Skeleton className={"w-[120px] h-[40px] rounded-full"} />
                    )}
                </View>
            </View>
        </View>
    );
}

export default function Page() {
    const { id, noHistory } = useLocalSearchParams<{ id: string; noHistory?: string }>();
    const edgeInsets = useSafeAreaInsets();

    // 添加歌单 UI 部分
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PageItem | undefined>();
    const handleClose = () => {
        setShowActionSheet(false);
    };

    // 数据请求
    const { data, error } = useQuery({
        queryKey: [id],
        queryFn: () => {
            return getBilisoundMetadata({ id });
        },
    });

    // 增加历史记录条目
    const { appendHistoryList } = useHistoryStore(state => ({
        appendHistoryList: state.appendHistoryList,
    }));

    useEffect(() => {
        if (data && !noHistory) {
            appendHistoryList({
                authorName: data.owner.name,
                id: data.bvid,
                name: data.title,
                thumbnailUrl: convertToHTTPS(data.pic),
                visitedAt: new Date(),
                key: v4(),
            });
        }
    }, [appendHistoryList, data, noHistory]);

    return (
        <GestureHandlerRootView>
            <Layout title={"查看详情"} leftAccessories={"BACK_BUTTON"} disableContentPadding={true}>
                {error ? (
                    <View className={"flex-1 items-center justify-center"}>
                        <ErrorContent message={error.message} />
                    </View>
                ) : (
                    <DualScrollView
                        edgeInsets={edgeInsets}
                        header={<MetaData data={data} showFullMeta />}
                        list={({ contentContainerStyle }) => (
                            <FlashList
                                estimatedItemSize={64}
                                contentContainerStyle={contentContainerStyle}
                                ListHeaderComponent={<MetaData data={data} className={"flex md:hidden px-4 pb-4"} />}
                                renderItem={e => (
                                    <SongItem
                                        onRequestPlay={() => addTrackFromDetail(data!.bvid, e.item.page)}
                                        onLongPress={() => {
                                            setDisplayTrack(e.item);
                                            setShowActionSheet(true);
                                        }}
                                        data={{
                                            author: data!.owner.name,
                                            bvid: data!.bvid,
                                            duration: e.item.duration,
                                            episode: e.item.page,
                                            title: e.item.partDisplayName,
                                            imgUrl: data!.pic,
                                            id: 0,
                                            playlistId: 0,
                                            extendedData: null,
                                        }}
                                    />
                                )}
                                data={data?.pages ?? []}
                            />
                        )}
                    />
                )}
            </Layout>

            {/* 曲目操作 */}
            {displayTrack && data ? (
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
                                openAddPlaylistPage({
                                    playlistDetail: [
                                        {
                                            author: data?.owner.name ?? "",
                                            bvid: data?.bvid ?? "",
                                            duration: displayTrack.duration,
                                            episode: displayTrack.page,
                                            title: displayTrack.part,
                                            imgUrl: data?.pic ?? "",
                                            id: 0,
                                            playlistId: 0,
                                            extendedData: null,
                                        },
                                    ],
                                    name: data?.title ?? "",
                                    description: data?.desc ?? "",
                                });
                                break;
                            case "close":
                                break;
                        }
                    }}
                    displayTrack={displayTrack}
                    data={data}
                />
            ) : null}
        </GestureHandlerRootView>
    );
}
