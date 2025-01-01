import { Layout } from "~/components/layout";
import { Text } from "~/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
    getBilisoundMetadata,
    GetEpisodeUserResponse,
    getUserList,
    getUserListFull,
    UserListMode,
} from "~/api/bilisound";
import { twMerge } from "tailwind-merge";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { Skeleton } from "~/components/ui/skeleton";
import { formatSecond } from "~/utils/datetime";
import { decodeHTML } from "entities";
import { SkeletonText } from "~/components/skeleton-text";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { ActivityIndicator, ScrollView, View, ViewStyle } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import Monicon from "@monicon/native";
import { ErrorContent } from "~/components/error-content";
import { FlashList } from "@shopify/flash-list";
import { VideoItem } from "~/components/video-item";
import useApplyPlaylistStore from "~/store/apply-playlist";
import Toast from "react-native-toast-message";

interface MetaDataProps {
    data?: GetEpisodeUserResponse["meta"];
    className?: string;
    style?: ViewStyle;
    mode: UserListMode;
}

function MetaData({ data, className, style, mode }: MetaDataProps) {
    const [loading, setLoading] = useState(false);

    // 添加歌单
    const { setPlaylistDetail, setName, setDescription, setSource, setCover } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
        setDescription: state.setDescription,
        setSource: state.setSource,
        setCover: state.setCover,
    }));

    async function handleCreatePlaylist() {
        if (!data) {
            return;
        }
        setLoading(true);
        try {
            const list = await getUserListFull(mode, data.userId, data.seasonId);
            const firstEpisode = await getBilisoundMetadata({ id: list[0].bvid });
            setPlaylistDetail(
                list.map(e => ({
                    author: firstEpisode.data.owner.name,
                    bvid: e.bvid ?? "",
                    duration: e.duration,
                    episode: 1,
                    title: e.title,
                    imgUrl: e.cover ?? "",
                    id: 0,
                    playlistId: 0,
                    extendedData: null,
                })),
            );
            setName(data.name);
            setDescription(data.description);
            setSource({
                type: "playlist",
                originalTitle: data.name,
                lastSyncAt: new Date().getTime(),
                subType: mode,
                userId: data.userId,
                listId: data.seasonId,
            });
            setCover(data.cover);
            router.push(`/apply-playlist`);
        } catch (e) {
            Toast.show({
                type: "error",
                text1: "歌单创建操作失败",
                text2: (e as Error)?.message || `${e}`,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className={twMerge("gap-4", className)} style={style}>
            {data ? (
                <Image source={getImageProxyUrl(data.cover)} className="aspect-[16/9] rounded-lg" />
            ) : (
                <Skeleton className="aspect-[16/9] rounded-lg w-[unset] h-[unset]" />
            )}
            <View>
                {data ? (
                    <Text className="text-base font-bold mb-4 leading-6 text-typography-700" selectable>
                        {data.name}
                    </Text>
                ) : (
                    <View className="gap-2 py-1 mb-4">
                        <Skeleton className="rounded-full h-4 w-2/3" />
                    </View>
                )}
                {data ? (
                    !!data.description.trim() && (
                        <Text className={"text-sm leading-normal break-words"}>{decodeHTML(data.description)}</Text>
                    )
                ) : (
                    <SkeletonText lineSize={6} fontSize={14} lineHeight={21} />
                )}
                <View className={"mt-4 flex-row gap-2"}>
                    {data ? (
                        <>
                            <ButtonOuter className={"rounded-full"}>
                                <Button className={"rounded-full"} onPress={handleCreatePlaylist}>
                                    <View className={"size-4 items-center justify-center"}>
                                        {loading ? (
                                            <ActivityIndicator className={"color-typography-0 size-4"} />
                                        ) : (
                                            <Monicon
                                                name={"fa6-solid:plus"}
                                                className={"color-typography-0"}
                                                size={16}
                                            />
                                        )}
                                    </View>
                                    <ButtonText>创建歌单</ButtonText>
                                </Button>
                            </ButtonOuter>
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
    const { userId, listId, mode } = useLocalSearchParams<{ userId: string; listId: string; mode: UserListMode }>();

    const edgeInsets = useSafeAreaInsets();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: [`getEpisodeUser_${mode}_${userId}_${listId}`],
        queryFn: ({ pageParam = 1 }) => getUserList(mode!, userId!, listId!, pageParam),
        getNextPageParam: lastPage => {
            if (lastPage.pageNum < Math.ceil(lastPage.total / lastPage.pageSize)) {
                return lastPage.pageNum + 1;
            }
            return undefined;
        },
    });

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    return (
        <Layout title={"合集详情"} leftAccessories={"BACK_BUTTON"}>
            {error ? (
                <View className={"flex-1 items-center justify-center"}>
                    <ErrorContent message={error.message} />
                </View>
            ) : (
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
                            <MetaData mode={mode} data={data?.pages[0].meta} />
                        </View>
                    </ScrollView>
                    <FlashList
                        estimatedItemSize={64}
                        contentContainerStyle={{
                            paddingLeft: 0,
                            paddingRight: edgeInsets.right,
                            paddingBottom: edgeInsets.bottom,
                        }}
                        ListHeaderComponent={
                            <MetaData mode={mode} data={data?.pages[0].meta} className={"flex md:hidden px-4 pb-4"} />
                        }
                        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
                        renderItem={e => (
                            <VideoItem
                                image={e.item.cover}
                                text1={e.item.title}
                                text2={formatSecond(e.item.duration)}
                                onPress={() => {
                                    router.navigate(`/video/${e.item.bvid}`);
                                }}
                            />
                        )}
                        data={data?.pages.flatMap(page => page.rows) || []}
                        keyExtractor={item => item.bvid}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                    />
                </View>
            )}
        </Layout>
    );
}
