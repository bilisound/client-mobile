import { MaterialIcons } from "@expo/vector-icons";
import { Box, Button, ButtonText, Pressable, Text } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getEpisodeUser, getEpisodeUserFull, GetEpisodeUserResponse, getUser } from "~/api/bilisound";
import CommonLayout from "~/components/CommonLayout";
import { COMMON_TOUCH_COLOR } from "~/constants/style";
import useAddPlaylistStore from "~/store/addPlaylist";
import { formatSecond } from "~/utils/misc";

interface HeaderProps {
    data: GetEpisodeUserResponse;
}

function Header({ data }: HeaderProps) {
    const [loading, setLoading] = useState(false);

    // 添加歌单
    const { setPlaylistDetail, setName } = useAddPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
    }));

    async function handleCreatePlaylist() {
        setLoading(true);
        const list = await getEpisodeUserFull(data.meta.mid, data.meta.season_id);
        const user = await getUser(data.meta.mid);
        console.log(JSON.stringify({ list, user }, null, 2));
        setLoading(false);
        setPlaylistDetail(
            list.map(e => ({
                author: user.name,
                bvid: e.bvid ?? "",
                duration: e.duration,
                episode: 1,
                title: e.title,
                imgUrl: e.cover ?? "",
            })),
        );
        setName(data.meta.name);
        router.push(`/apply-playlist`);
    }

    return (
        <Box flex={0} padding="$4">
            <Image
                source={data.meta.cover}
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
                {data.meta.name}
            </Text>
            {/* 简介 */}
            <Text fontSize={15} lineHeight={15 * 1.5}>
                {data.meta.description}
            </Text>
            {/* 操作 */}
            <Box flexDirection="row">
                <Button
                    mt="$5"
                    rounded="$full"
                    size="md"
                    variant="solid"
                    action="primary"
                    isDisabled={false}
                    isFocusVisible={false}
                    onPress={handleCreatePlaylist}
                >
                    {loading ? (
                        <ActivityIndicator style={{ width: 22, height: 22 }} color="white" />
                    ) : (
                        <MaterialIcons name="add" size={22} color="white" />
                    )}
                    <ButtonText fontSize="$sm"> 创建歌单</ButtonText>
                </Button>
            </Box>
        </Box>
    );
}

export default function Page() {
    const { userId, episodeId } = useLocalSearchParams<{ userId?: string; episodeId?: string }>();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: [`getEpisodeUser_${userId}_${episodeId}`],
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
            {/* 图片 */}
            <Image
                source={item.cover}
                style={{
                    height: 48,
                    aspectRatio: "3/2",
                    flex: 0,
                    borderRadius: 8,
                }}
            />
            {/* 文字内容 */}
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
        <CommonLayout title="合集详情" leftAccessories="backButton">
            <View style={{ flex: 1 }}>
                <FlashList
                    data={data?.pages.flatMap(page => page.rows) || []}
                    renderItem={renderItem}
                    keyExtractor={item => item.bvid}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={data?.pages[0] ? <Header data={data.pages[0]} /> : null}
                    ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
                    estimatedItemSize={100}
                />
            </View>
        </CommonLayout>
    );
}
