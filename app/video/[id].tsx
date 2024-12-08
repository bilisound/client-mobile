import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { convertToHTTPS } from "~/utils/string";
import { v4 } from "uuid";
import { useEffect } from "react";
import useHistoryStore from "~/store/history";
import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "~/api/bilisound";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "~/components/ui/skeleton";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDate } from "~/utils/datetime";
import React from "react";
import { FlashList } from "@shopify/flash-list";

interface MetaDataProps {
    data?: GetBilisoundMetadataResponse;
    className?: string;
    style?: ViewStyle;
}

function MetaData({ data, className, style }: MetaDataProps) {
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
            </View>
        </View>
    );
}

export default function Page() {
    const { id, noHistory } = useLocalSearchParams<{ id: string; noHistory?: string }>();
    const edgeInsets = useSafeAreaInsets();

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

    return (
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
                    contentContainerStyle={{
                        paddingLeft: 0,
                        paddingRight: edgeInsets.right,
                        paddingBottom: edgeInsets.bottom,
                    }}
                    ListHeaderComponent={<MetaData data={data?.data} className={"flex md:hidden px-4 pb-4"} />}
                    renderItem={e => (
                        <View className={"h-8 border-b bg-red-200"}>
                            <Text>{e.item.part}</Text>
                        </View>
                    )}
                    data={data?.data.pages ?? []}
                />
            </View>
        </Layout>
    );
}
