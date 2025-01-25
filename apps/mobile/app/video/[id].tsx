import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { convertToHTTPS } from "~/utils/string";
import { v4 } from "uuid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useHistoryStore from "~/store/history";
import { getBilisoundMetadata } from "~/api/bilisound";
import { useQuery } from "@tanstack/react-query";
import { View, ViewStyle, Animated } from "react-native";
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
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
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
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import log from "~/utils/logger";
import { GetMetadataResponse } from "@bilisound/sdk";

type PageItem = GetMetadataResponse["pages"][number];

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
            <ActionsheetContent style={{ zIndex: 999 }}>
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

interface MetaDataProps {
    data?: GetMetadataResponse;
    className?: string;
    style?: ViewStyle;
    onOpenModal?: () => void;
}

function MetaData({ data, className, style, onOpenModal }: MetaDataProps) {
    const { setPlaylistDetail, setName, setDescription, setSource, setCover } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
        setDescription: state.setDescription,
        setSource: state.setSource,
        setCover: state.setCover,
    }));

    function handleCreatePlaylist() {
        const meta = data;
        if (!meta) {
            log.error("使用 handleCreatePlaylist 函数时，meta 没有准备就绪！");
            return;
        }
        setPlaylistDetail(
            meta.pages.map(e => ({
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
        );
        setName(meta.title);
        setDescription(meta.desc);
        setSource({ type: "video", bvid: meta.bvid, originalTitle: meta.title, lastSyncAt: new Date().getTime() });
        setCover(meta.pic);
        router.push(`/apply-playlist`);
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
                        {onOpenModal ? (
                            <Pressable onPress={onOpenModal}>
                                <Text className={"text-sm leading-normal break-words line-clamp-6"}>
                                    {decodeHTML(data.desc)}
                                </Text>
                            </Pressable>
                        ) : (
                            <Text className={"text-sm leading-normal break-words"}>{decodeHTML(data.desc)}</Text>
                        )}
                    </>
                ) : (
                    <SkeletonText lineSize={6} fontSize={14} lineHeight={21} />
                )}
                <View className={"mt-4 flex-row gap-2"}>
                    {data ? (
                        <>
                            <ButtonOuter className={"rounded-full"}>
                                <Button className={"rounded-full"} onPress={handleCreatePlaylist}>
                                    <ButtonMonIcon name={"fa6-solid:plus"} size={16} />
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
    const { colorValue } = useRawThemeValues();

    // 添加歌单
    const { setPlaylistDetail, setName, setDescription, setSource, setCover } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
        setDescription: state.setDescription,
        setSource: state.setSource,
        setCover: state.setCover,
    }));

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

    // 详情文本展示

    // hooks
    const sheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ["40%", "75%"], []);

    const backdropOpacity = useRef(new Animated.Value(0)).current;

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
                        header={<MetaData data={data} />}
                        list={({ contentContainerStyle }) => (
                            <FlashList
                                estimatedItemSize={64}
                                contentContainerStyle={contentContainerStyle}
                                ListHeaderComponent={
                                    <MetaData
                                        data={data}
                                        className={"flex md:hidden px-4 pb-4"}
                                        onOpenModal={() => {
                                            sheetRef.current?.snapToIndex(0);
                                        }}
                                    />
                                }
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
                                            title: e.item.part,
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

            {/* 详情内容 */}
            <Animated.View
                style={{
                    opacity: backdropOpacity,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    pointerEvents: "none",
                }}
                aria-hidden
            />
            <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                enablePanDownToClose={true}
                onAnimate={(fromIndex, toIndex) => {
                    if (toIndex >= 0) {
                        Animated.timing(backdropOpacity, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }).start();
                    } else {
                        Animated.timing(backdropOpacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }).start();
                    }
                }}
                style={{
                    borderTopStartRadius: 14,
                    borderTopEndRadius: 14,
                }}
                handleStyle={{
                    backgroundColor: "transparent",
                }}
                handleIndicatorStyle={{
                    backgroundColor: colorValue("--color-typography-700"),
                    width: 80,
                }}
                containerStyle={{
                    backgroundColor: "transparent",
                }}
                backgroundStyle={{
                    backgroundColor: colorValue("--color-background-50"),
                }}
            >
                <BottomSheetScrollView
                    className={"bg-background-50"}
                    contentContainerStyle={{
                        paddingLeft: edgeInsets.left + 16,
                        paddingRight: edgeInsets.right + 16,
                        paddingBottom: edgeInsets.bottom + 16,
                    }}
                >
                    <Text className={"text-lg leading-normal font-semibold mb-2"}>视频简介</Text>
                    <Text className={"text-sm leading-normal break-words"} selectable>
                        {decodeHTML(data?.desc ?? "")}
                    </Text>
                </BottomSheetScrollView>
            </BottomSheet>

            {/* 曲目操作 */}
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
                            setName(data?.title ?? "");
                            setDescription(data?.desc ?? "");
                            setPlaylistDetail([
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
        </GestureHandlerRootView>
    );
}
