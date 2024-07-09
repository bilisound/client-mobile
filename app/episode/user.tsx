import { Box, Pressable, Text } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import { getEpisodeUser, GetEpisodeUserResponse } from "~/api/bilisound";
import CommonLayout from "~/components/CommonLayout";
import { COMMON_TOUCH_COLOR } from "~/constants/style";
import { formatSecond } from "~/utils/misc";

export default function Page() {
    const { userId, episodeId } = useLocalSearchParams<{ userId?: string; episodeId?: string }>();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: ["items"],
        queryFn: ({ pageParam = 1 }) => getEpisodeUser(userId!, episodeId!, pageParam),
        getNextPageParam: lastPage => {
            if (lastPage.pageNum < Math.ceil(lastPage.total / lastPage.pageSize)) {
                return lastPage.pageNum + 1;
            }
            return undefined;
        },
    });

    const renderItem = ({ item }: { item: GetEpisodeUserResponse["rows"][number] }) => (
        <Pressable
            onPress={() => {
                router.push(`/query/${item.bvid}`);
            }}
            onLongPress={() => null}
            sx={{
                ...COMMON_TOUCH_COLOR,
                flexDirection: "row",
                alignItems: "center",
                height: 72,
                paddingHorizontal: 16,
                gap: 16,
            }}
        >
            <Image
                source={item.cover}
                style={{
                    height: 48,
                    aspectRatio: "3/2",
                    flex: 0,
                    borderRadius: 8,
                }}
            />
            <Box
                sx={{
                    flex: 1,
                    gap: "$1",
                }}
            >
                <Text
                    sx={{
                        fontWeight: "bold",
                        fontSize: 14,
                    }}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {item.title}
                </Text>
                <Text
                    sx={{
                        opacity: 0.5,
                        fontSize: 12,
                    }}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {formatSecond(item.duration)}
                </Text>
            </Box>
        </Pressable>
    );

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    return (
        <CommonLayout title="合集详情" extendToBottom leftAccessories="backButton">
            <View style={{ flex: 1 }}>
                <FlashList
                    data={data?.pages.flatMap(page => page.rows) || []}
                    renderItem={renderItem}
                    keyExtractor={item => item.bvid}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={
                        data?.pages[0] ? (
                            <Box flex={0} padding="$4">
                                <Image
                                    source={data?.pages[0].meta.cover}
                                    style={{
                                        aspectRatio: "16/9",
                                        borderRadius: 8,
                                        flex: 1,
                                    }}
                                />
                                {/* 标题 */}
                                <Text
                                    sx={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        marginTop: 16,
                                        marginBottom: 16,
                                        lineHeight: 24,
                                    }}
                                    selectable
                                >
                                    {data?.pages[0].meta.name}
                                </Text>
                                {/*   简介 */}
                                <Text fontSize={15} lineHeight={15 * 1.5}>
                                    {data?.pages[0].meta.description}
                                </Text>
                            </Box>
                        ) : null
                    }
                    ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
                    estimatedItemSize={100}
                />
            </View>
        </CommonLayout>
    );
}
