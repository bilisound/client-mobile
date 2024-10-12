import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import TrackPlayer from "react-native-track-player";

import CommonLayout from "~/components/CommonLayout";
import PlaylistItem from "~/components/PlaylistItem";
import { VideoItem } from "~/components/VideoItem";
import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { Text } from "~/components/ui/text";
import useTracks from "~/hooks/useTracks";
import { usePlaylistOnQueue } from "~/storage/playlist";
import { addToQueueListBackup, getQueuePlayingMode } from "~/storage/queue";
import { addToPlaylist, getPlaylistMetas, quickCreatePlaylist, syncPlaylistAmount } from "~/storage/sqlite/playlist";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { playlistToTracks } from "~/utils/track-data";

export default function Page() {
    const [playlistOnQueue = {}] = usePlaylistOnQueue();
    const { update } = useTracks();

    // 添加歌单
    const { playlistDetail, name, description, source } = useApplyPlaylistStore(state => ({
        playlistDetail: state.playlistDetail,
        name: state.name,
        description: state.description,
        source: state.source,
    }));

    const edgeInsets = useSafeAreaInsets();
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ["playlist_meta"],
        queryFn: () => getPlaylistMetas(true),
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

    const isSingle = playlistDetail && playlistDetail.length === 1;

    return (
        <CommonLayout
            title="添加到歌单"
            leftAccessories="backButton"
            overrideEdgeInsets={{
                bottom: 0,
            }}
        >
            <View className={`gap-2 pt-4 ${isSingle ? "pb-2" : "pb-4"}`}>
                <Text className="px-5 font-semibold opacity-60">
                    {playlistDetail?.length === 1
                        ? "添加以下曲目到指定歌单："
                        : `添加 ${playlistDetail?.length} 项到指定歌单：`}
                </Text>
                {isSingle && (
                    <VideoItem
                        image={getImageProxyUrl(playlistDetail[0].imgUrl, playlistDetail[0].bvid)}
                        text1={playlistDetail[0].title}
                        text2={playlistDetail[0].author}
                    />
                )}
            </View>
            <FlashList
                ListHeaderComponent={
                    <PotatoPressable
                        className="gap-1 px-5 py-3"
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
                        <View className="flex-row items-center gap-3">
                            <MaterialIcons name="add" size={24} color="red" />
                            <Text className="text-base leading-normal flex-1" numberOfLines={1} ellipsizeMode="tail">
                                {name}
                            </Text>
                        </View>
                        <Text className="ml-9 text-sm leading-normal opacity-60">添加新的歌单</Text>
                    </PotatoPressable>
                }
                ListFooterComponent={
                    <Text
                        className="text-sm px-5 opacity-60 pt-4 text-center"
                        style={{ paddingBottom: edgeInsets.bottom + 16 }}
                    >
                        与上游播放列表绑定的歌单不在这里展示
                    </Text>
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
