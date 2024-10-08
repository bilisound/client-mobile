import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import Toast from "react-native-toast-message";
import TrackPlayer from "react-native-track-player";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import PlaylistItem from "~/components/PlaylistItem";
import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import useTracks from "~/hooks/useTracks";
import { usePlaylistOnQueue } from "~/storage/playlist";
import { addToQueueListBackup, getQueuePlayingMode } from "~/storage/queue";
import { addToPlaylist, getPlaylistMetas, quickCreatePlaylist, syncPlaylistAmount } from "~/storage/sqlite/playlist";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { playlistToTracks } from "~/utils/track-data";

export default function Page() {
    const { styles } = useStyles(styleSheet);

    const [playlistOnQueue = {}] = usePlaylistOnQueue();
    const { update } = useTracks();

    // 添加歌单
    const { playlistDetail, name, description, source } = useApplyPlaylistStore(state => ({
        playlistDetail: state.playlistDetail,
        name: state.name,
        description: state.description,
        source: state.source,
    }));

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ["playlist_meta"],
        queryFn: getPlaylistMetas,
    });

    async function handleAddToPlaylist(id: number) {
        await addToPlaylist(id, playlistDetail ?? []);
        await syncPlaylistAmount(id);

        // 如果当前的 queue 来自试图被添加的播放列表，给 queue 也添加这些曲目
        if (playlistOnQueue) {
            const convertedList = playlistToTracks(playlistDetail ?? []);
            await TrackPlayer.add(convertedList);
            await update();

            // 随机状态下还要加到备份队列中
            if (getQueuePlayingMode() === "shuffle") {
                addToQueueListBackup(convertedList);
            }
        }

        await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });
        await queryClient.invalidateQueries({ queryKey: [`playlist_meta_${id}`] });
        await queryClient.invalidateQueries({ queryKey: [`playlist_detail_${id}`] });
        Toast.show({
            type: "success",
            text1: "曲目添加成功",
            text2: `已添加 ${playlistDetail?.length ?? 0} 首曲目到歌单`,
        });
        router.back();
    }

    return (
        <CommonLayout title="添加到歌单" leftAccessories="backButton">
            <View style={styles.container}>
                <Text style={styles.headerText}>
                    {playlistDetail?.length === 1
                        ? "添加以下曲目到指定歌单："
                        : `添加 ${playlistDetail?.length} 项到指定歌单：`}
                </Text>
                {playlistDetail && playlistDetail.length === 1 && (
                    <View style={styles.singleItemContainer}>
                        <Image
                            source={getImageProxyUrl(playlistDetail[0].imgUrl, playlistDetail[0].bvid)}
                            style={styles.image}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                                {playlistDetail[0].title}
                            </Text>
                            <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
                                {playlistDetail[0].author}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
            <FlashList
                ListHeaderComponent={
                    <PotatoPressable
                        style={[styles.pressable]}
                        onPress={async () => {
                            await quickCreatePlaylist(name, description, playlistDetail ?? [], source);
                            await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });
                            Toast.show({
                                type: "success",
                                text1: "歌单创建成功",
                                text2: `新歌单的名称：${name}`,
                            });
                            router.back();
                        }}
                    >
                        <View style={styles.pressableContent}>
                            <MaterialIcons name="add" size={24} color="red" />
                            <Text style={styles.pressableText} numberOfLines={1} ellipsizeMode="tail">
                                {name}
                            </Text>
                        </View>
                        <Text style={styles.pressableSubtext}>添加新的歌单</Text>
                    </PotatoPressable>
                }
                renderItem={item => {
                    return <PlaylistItem item={item.item} onPress={() => handleAddToPlaylist(item.item.id)} />;
                }}
                data={data}
                estimatedItemSize={86}
            />
        </CommonLayout>
    );
}

const styleSheet = createStyleSheet(theme => ({
    container: {
        gap: 16,
        paddingVertical: 16,
    },
    headerText: {
        paddingHorizontal: 20,
        fontWeight: "700",
        opacity: 0.6,
        color: theme.colorTokens.foreground,
    },
    singleItemContainer: {
        width: "100%",
        paddingHorizontal: 20,
        flexDirection: "row",
        gap: 16,
    },
    image: {
        height: 48,
        aspectRatio: 16 / 9,
        flex: 0,
        flexBasis: "auto",
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colorTokens.foreground,
    },
    author: {
        fontSize: 14,
        opacity: 0.7,
        color: theme.colorTokens.foreground,
    },
    pressable: {
        gap: 4,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    pressableContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    pressableText: {
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
        color: theme.colorTokens.foreground,
    },
    pressableSubtext: {
        marginLeft: 36,
        fontSize: 14,
        opacity: 0.6,
        lineHeight: 21,
        color: theme.colorTokens.foreground,
    },
    toastContainer: {
        gap: 4,
    },
}));
