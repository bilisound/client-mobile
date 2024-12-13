import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { convertToHTTPS } from "~/utils/string";
import { v4 } from "uuid";
import { createContext, useCallback, useEffect, useMemo } from "react";
import useHistoryStore from "~/store/history";
import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "~/api/bilisound";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, ViewStyle, StyleSheet } from "react-native";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "~/components/ui/skeleton";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDate } from "~/utils/datetime";
import React, { useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { SongItem } from "~/components/song-item";
import { SkeletonText } from "~/components/skeleton-text";
import { Pressable } from "~/components/ui/pressable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";

interface MetaDataProps {
    data?: GetBilisoundMetadataResponse;
    className?: string;
    style?: ViewStyle;
    onOpenModal?: () => void;
}

function MetaData({ data, className, style, onOpenModal }: MetaDataProps) {
    return (
        <View className={twMerge("gap-4", className)} style={style}>
            {data ? (
                <Image source={getImageProxyUrl(data.pic, data.bvid)} className="aspect-[16/9] rounded-lg" />
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
                                source={getImageProxyUrl(data.owner.face, data.bvid)}
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
                                <Text className={"text-sm leading-normal break-words line-clamp-6"}>{data.desc}</Text>
                            </Pressable>
                        ) : (
                            <Text className={"text-sm leading-normal break-words"}>{data.desc}</Text>
                        )}
                    </>
                ) : (
                    <SkeletonText lineSize={6} fontSize={14} lineHeight={21} />
                )}
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

    // 详情文本展示

    // hooks
    const sheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ["30%", "75%"], []);

    // callbacks
    const handleSheetChange = useCallback((index: number) => {
        // console.log("handleSheetChange", index);
    }, []);

    return (
        <GestureHandlerRootView>
            <Layout title={"查看详情"} leftAccessories={"BACK_BUTTON"} disableContentPadding={true}>
                <View className={"flex-1 flex-row"}>
                    <ScrollView className={"hidden md:flex flex-1"}>
                        <View
                            style={{
                                paddingLeft: edgeInsets.left + 16,
                                paddingRight: 16,
                                paddingBottom: edgeInsets.bottom + 16,
                            }}
                        >
                            {/*<MetaData />*/}
                            <MetaData data={data?.data} />
                        </View>
                    </ScrollView>
                    <FlashList
                        estimatedItemSize={64}
                        contentContainerStyle={{
                            paddingLeft: 0,
                            paddingRight: edgeInsets.right,
                            paddingBottom: edgeInsets.bottom,
                        }}
                        // ListHeaderComponent={<MetaData className={"flex md:hidden px-4 pb-4"} />}
                        ListHeaderComponent={
                            <MetaData
                                data={data?.data}
                                className={"flex md:hidden px-4 pb-4"}
                                onOpenModal={() => {
                                    sheetRef.current?.snapToIndex(0);
                                }}
                            />
                        }
                        renderItem={e => (
                            <SongItem
                                data={{
                                    author: data!.data.owner.name,
                                    bvid: data!.data.bvid,
                                    duration: e.item.duration,
                                    episode: e.item.page,
                                    title: e.item.part,
                                    imgUrl: data!.data.pic,
                                    id: 0,
                                    playlistId: 0,
                                    extendedData: null,
                                }}
                            />
                        )}
                        data={data?.data.pages ?? []}
                    />
                </View>
            </Layout>
            <BottomSheet
                ref={sheetRef}
                index={-1}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                onChange={handleSheetChange}
                enablePanDownToClose={true}
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
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                    <Text className={"text-xl leading-normal font-semibold mb-2"}>视频简介</Text>
                    <Text className={"text-sm leading-normal break-words"} selectable>
                        {data?.data.desc}
                    </Text>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}
