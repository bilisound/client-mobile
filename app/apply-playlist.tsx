import { Box, Text } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";

import CommonLayout from "../components/CommonLayout";
import PlaylistItem from "../components/PlaylistItem";
import { addToPlaylist, syncPlaylistAmount, usePlaylistStorage } from "../storage/playlist";
import useAddPlaylistStore from "../store/addPlaylist";

export default function Page() {
    // 添加播放列表
    const { playlistDetail } = useAddPlaylistStore(state => ({
        playlistDetail: state.playlistDetail,
        name: state.name,
    }));

    const [playlistStorage] = usePlaylistStorage();

    return (
        <CommonLayout title="添加到歌单" leftAccessories="backButton">
            <Box gap="$4" py="$4">
                <Text px="$5" fontWeight="700" opacity={0.6}>
                    {playlistDetail?.length === 1
                        ? "添加以下曲目到指定歌单："
                        : `添加 ${playlistDetail?.length} 项到指定歌单：`}
                </Text>
                {playlistDetail && playlistDetail.length === 1 && (
                    <Box w="100%" px="$5" flexDirection="row" gap="$4">
                        <Image
                            source={playlistDetail[0].imgUrl}
                            style={{
                                height: 48,
                                aspectRatio: "16/9",
                                flex: 0,
                                borderRadius: 8,
                            }}
                        />
                        <Box flex={1} gap="$1">
                            <Text numberOfLines={1} ellipsizeMode="tail" fontSize={16} fontWeight="700">
                                {playlistDetail[0].title}
                            </Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" fontSize={14} opacity={0.7}>
                                {playlistDetail[0].author}
                            </Text>
                        </Box>
                    </Box>
                )}
            </Box>
            <FlashList
                renderItem={item => {
                    return (
                        <PlaylistItem
                            item={item.item}
                            onPress={() => {
                                addToPlaylist(item.item.id, playlistDetail ?? []);
                                syncPlaylistAmount(item.item.id);
                                router.back();
                            }}
                        />
                    );
                }}
                data={playlistStorage}
                estimatedItemSize={86}
            />
        </CommonLayout>
    );
}
