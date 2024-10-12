import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import {
    getBilisoundMetadata,
    getUserList,
    getUserListFull,
    GetEpisodeUserResponse,
    UserListMode,
} from "~/api/bilisound";
import CommonLayout from "~/components/CommonLayout";
import PotatoButton from "~/components/potato-ui/PotatoButton";
import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Text } from "~/components/ui/text";
import { SCREEN_BREAKPOINTS } from "~/constants/style";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { formatSecond } from "~/utils/datetime";

const IconAdd = createIcon(MaterialIcons, "add");

interface HeaderProps {
    data: GetEpisodeUserResponse;
    mode: UserListMode;
}

function Header({ data, mode }: HeaderProps) {
    const { styles } = useStyles(styleSheet);
    const [loading, setLoading] = useState(false);

    // 添加歌单
    const { setPlaylistDetail, setName, setDescription, setSource } = useApplyPlaylistStore(state => ({
        setPlaylistDetail: state.setPlaylistDetail,
        setName: state.setName,
        setDescription: state.setDescription,
        setSource: state.setSource,
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
                    id: 0,
                    playlistId: 0,
                    extendedData: null,
                })),
            );
            setName(data.meta.name);
            setDescription(data.meta.description);
            setSource({
                type: "playlist",
                originalTitle: data.meta.name,
                lastSyncAt: new Date().getTime(),
                subType: mode,
                userId: data.meta.userId,
                listId: data.meta.seasonId,
            });
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
        <View style={styles.container}>
            <Image source={getImageProxyUrl(data.meta.cover, data.rows[0].bvid)} style={styles.image} />
            <Text className="text-lg leading-[24px] font-semibold mt-4" selectable>
                {data.meta.name}
            </Text>
            {data.meta.description && <Text className="text-[15px] leading-normal mt-4">{data.meta.description}</Text>}
            <View className="flex-row mt-5">
                <PotatoButton
                    rounded
                    disabled={loading}
                    Icon={loading ? "loading" : IconAdd}
                    onPress={handleCreatePlaylist}
                >
                    创建歌单
                </PotatoButton>
            </View>
        </View>
    );
}

function HeaderSkeleton() {
    const { styles, theme } = useStyles(styleSheet);
    const textBasicColor = theme.colorTokens.foreground;

    const skeletonBlock = {
        backgroundColor: textBasicColor,
        borderRadius: 8,
        opacity: 0.1,
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    ...skeletonBlock,
                    aspectRatio: "16/9",
                    flex: 0,
                    flexBasis: "auto",
                }}
            />
            <View
                style={{
                    marginTop: 16,
                    height: 24,
                }}
            >
                <View
                    style={{
                        ...skeletonBlock,
                        height: 16,
                    }}
                />
            </View>
            <View style={{ height: 15 * 1.5, marginTop: 16 }}>
                <View
                    style={{
                        ...skeletonBlock,
                        height: 15,
                    }}
                />
            </View>
            <View style={{ flexDirection: "row" }}>
                <View
                    style={{
                        ...skeletonBlock,
                        height: 40,
                        width: 120,
                        marginTop: 20,
                        borderRadius: 9999,
                    }}
                />
            </View>
        </View>
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
        <PotatoPressable
            onPress={() => {
                router.push(`/query/${item.bvid}`);
            }}
            className="flex-row items-center py-3 px-4 gap-4"
        >
            <Image
                source={getImageProxyUrl(item.cover, item.bvid)}
                className="h-12 aspect-[3/2] flex-0 basis-auto rounded-lg"
            />
            <View className="flex-1 gap-1">
                <Text className="font-semibold text-sm leading-normal" ellipsizeMode="tail" numberOfLines={1}>
                    {item.title}
                </Text>
                <Text className="text-xs opacity-50 leading-normal" ellipsizeMode="tail" numberOfLines={1}>
                    {formatSecond(item.duration)}
                </Text>
            </View>
        </PotatoPressable>
    );

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    return (
        <CommonLayout
            title="合集详情"
            leftAccessories="backButton"
            overrideEdgeInsets={{
                bottom: 0,
            }}
        >
            {data ? (
                <View className="flex-1 flex-row">
                    <View className="hidden md:flex flex-1 lg:basis-auto lg:flex-0 lg:w-[384px]">
                        <ScrollView>
                            <Header data={data.pages[0]} mode={mode!} />
                            <View style={{ height: edgeInsets.bottom }} aria-hidden />
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1 }}>
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
                                    <View style={{ height: 4 }} aria-hidden />
                                )
                            }
                            ListFooterComponent={
                                <>
                                    {isFetchingNextPage ? <ActivityIndicator /> : null}
                                    <View style={{ height: edgeInsets.bottom }} aria-hidden />
                                </>
                            }
                            estimatedItemSize={100}
                        />
                    </View>
                </View>
            ) : (
                <View style={{ flex: 1, flexDirection: "row" }}>
                    {width >= SCREEN_BREAKPOINTS.md ? (
                        <View style={{ flex: 0, flexBasis: "auto", width: 384 }}>
                            <HeaderSkeleton />
                        </View>
                    ) : null}
                    <View style={{ flex: 1 }}>{width < SCREEN_BREAKPOINTS.md ? <HeaderSkeleton /> : null}</View>
                </View>
            )}
        </CommonLayout>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        padding: 16,
    },
    image: {
        aspectRatio: 16 / 9,
        borderRadius: 8,
        flex: 0,
        flexBasis: "auto",
    },
}));
