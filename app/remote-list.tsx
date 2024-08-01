import { MaterialIcons } from "@expo/vector-icons";
import {
    Box,
    Button,
    ButtonText,
    Pressable,
    Text,
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
    VStack,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
    getBilisoundMetadata,
    getUserList,
    getUserListFull,
    GetEpisodeUserResponse,
    UserListMode,
} from "~/api/bilisound";
import CommonLayout from "~/components/CommonLayout";
import { COMMON_TOUCH_COLOR, SCREEN_BREAKPOINTS } from "~/constants/style";
import useToastContainerStyle from "~/hooks/useToastContainerStyle";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { formatSecond } from "~/utils/misc";

interface HeaderProps {
    data: GetEpisodeUserResponse;
    mode: UserListMode;
}

function Header({ data, mode }: HeaderProps) {
    const containerStyle = useToastContainerStyle();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    // 添加歌单
    const { setPlaylistDetail, setName } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
    }));

    async function handleCreatePlaylist() {
        setLoading(true);
        try {
            const list = await getUserListFull(mode, data.meta.userId, data.meta.seasonId);
            const firstEpisode = await getBilisoundMetadata({ id: list[0].bvid });
            setPlaylistDetail(
                list.map(e => ({
                    author: firstEpisode.data.owner.name,
                    bvid: e.bvid ?? "",
                    duration: e.duration,
                    episode: 1,
                    title: e.title,
                    imgUrl: e.cover ?? "",
                })),
            );
            setName(data.meta.name);
            router.push(`/apply-playlist`);
        } catch (e) {
            toast.show({
                placement: "top",
                containerStyle,
                render: ({ id }) => (
                    <Toast nativeID={`toast-${id}`} action="success" variant="accent">
                        <VStack space="xs">
                            <ToastTitle>歌单创建操作失败</ToastTitle>
                            <ToastDescription>{(e as Error)?.message || `${e}`}</ToastDescription>
                        </VStack>
                    </Toast>
                ),
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box flex={0} flexBasis="auto" padding="$4">
            <Image
                source={getImageProxyUrl(data.meta.cover, data.rows[0].bvid)}
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
                    lineHeight: 24,
                }}
                selectable
            >
                {data.meta.name}
            </Text>
            {/* 简介 */}
            {data.meta.description && (
                <Text fontSize={15} lineHeight={15 * 1.5} marginTop={16}>
                    {data.meta.description}
                </Text>
            )}
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
    const { userId, listId, mode } = useLocalSearchParams<{ userId: string; listId: string; mode: UserListMode }>();

    const { width } = useWindowDimensions();
    const edgeInsets = useSafeAreaInsets();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
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
                source={getImageProxyUrl(item.cover, item.bvid)}
                style={{
                    height: 48,
                    aspectRatio: "3/2",
                    flex: 0,
                    flexBasis: "auto",
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
        <CommonLayout title="合集详情" leftAccessories="backButton" extendToBottom>
            {data ? (
                <Box sx={{ flex: 1, flexDirection: "row" }}>
                    {width >= SCREEN_BREAKPOINTS.md ? (
                        <Box flex={0} flexBasis="auto" width={384}>
                            <ScrollView>
                                <Header data={data.pages[0]} mode={mode!} />
                                <Box height={edgeInsets.bottom} aria-hidden />
                            </ScrollView>
                        </Box>
                    ) : null}
                    <Box sx={{ flex: 1 }}>
                        <FlashList
                            data={data.pages.flatMap(page => page.rows) || []}
                            renderItem={renderItem}
                            keyExtractor={item => item.bvid}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.5}
                            ListHeaderComponent={
                                width < SCREEN_BREAKPOINTS.md && data.pages[0] ? (
                                    <Header data={data.pages[0]} mode={mode!} />
                                ) : (
                                    <Box height={4} aria-hidden />
                                )
                            }
                            ListFooterComponent={
                                <>
                                    {isFetchingNextPage ? <ActivityIndicator /> : null}
                                    <Box height={edgeInsets.bottom} aria-hidden />
                                </>
                            }
                            estimatedItemSize={100}
                        />
                    </Box>
                </Box>
            ) : null}
        </CommonLayout>
    );
}
