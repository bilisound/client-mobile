import { MaterialIcons } from "@expo/vector-icons";
import { Toast, ToastDescription, ToastTitle, useToast } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import {
    getBilisoundMetadata,
    getUserList,
    getUserListFull,
    GetEpisodeUserResponse,
    UserListMode,
} from "~/api/bilisound";
import CommonLayout from "~/components/CommonLayout";
import Pressable from "~/components/ui/Pressable";
import { SCREEN_BREAKPOINTS } from "~/constants/style";
import useCommonColors from "~/hooks/useCommonColors";
import useToastContainerStyle from "~/hooks/useToastContainerStyle";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { formatSecond } from "~/utils/misc";

interface HeaderProps {
    data: GetEpisodeUserResponse;
    mode: UserListMode;
}

function Header({ data, mode }: HeaderProps) {
    const { styles } = useStyles(styleSheet);
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
                        <View>
                            <ToastTitle>歌单创建操作失败</ToastTitle>
                            <ToastDescription>{(e as Error)?.message || `${e}`}</ToastDescription>
                        </View>
                    </Toast>
                ),
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={getImageProxyUrl(data.meta.cover, data.rows[0].bvid)} style={styles.image} />
            <Text style={styles.title} selectable>
                {data.meta.name}
            </Text>
            {data.meta.description && <Text style={styles.description}>{data.meta.description}</Text>}
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={styles.button} disabled={false} onPress={handleCreatePlaylist}>
                    {loading ? (
                        <ActivityIndicator style={{ width: 22, height: 22 }} color="white" />
                    ) : (
                        <MaterialIcons name="add" size={22} color="white" />
                    )}
                    <Text style={styles.buttonText}>创建歌单</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function HeaderSkeleton() {
    const { styles } = useStyles(styleSheet);
    const { textBasicColor } = useCommonColors();

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
    const { styles } = useStyles(styleSheet);
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
            style={styles.listItem}
        >
            <Image source={getImageProxyUrl(item.cover, item.bvid)} style={styles.listItemImage} />
            <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle} ellipsizeMode="tail" numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.listItemDuration} ellipsizeMode="tail" numberOfLines={1}>
                    {formatSecond(item.duration)}
                </Text>
            </View>
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
                <View style={{ flex: 1, flexDirection: "row" }}>
                    {width >= SCREEN_BREAKPOINTS.md ? (
                        <View style={{ flex: 0, flexBasis: "auto", width: 384 }}>
                            <ScrollView>
                                <Header data={data.pages[0]} mode={mode!} />
                                <View style={{ height: edgeInsets.bottom }} aria-hidden />
                            </ScrollView>
                        </View>
                    ) : null}
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
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        lineHeight: 24,
        color: theme.colorTokens.foreground,
    },
    description: {
        fontSize: 15,
        lineHeight: 15 * 1.5,
        marginTop: 16,
        color: theme.colorTokens.foreground,
    },
    button: {
        marginTop: 20,
        borderRadius: 9999,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "blue",
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        marginLeft: 5,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        height: 72,
        paddingHorizontal: 16,
        gap: 16,
    },
    listItemImage: {
        height: 48,
        aspectRatio: "3/2",
        flex: 0,
        flexBasis: "auto",
        borderRadius: 8,
    },
    listItemContent: {
        flex: 1,
        gap: 4,
    },
    listItemTitle: {
        fontWeight: "bold",
        fontSize: 14,
        color: theme.colorTokens.foreground,
    },
    listItemDuration: {
        opacity: 0.5,
        fontSize: 12,
        color: theme.colorTokens.foreground,
    },
}));
