import { MaterialIcons } from "@expo/vector-icons";
import { Box, Pressable, Text, Toast, ToastDescription, ToastTitle, useToast, VStack } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";

import CommonLayout from "../components/CommonLayout";
import PlaylistItem from "../components/PlaylistItem";
import { COMMON_TOUCH_COLOR } from "../constants/style";
import useToastContainerStyle from "../hooks/useToastContainerStyle";
import { addToPlaylist, quickCreatePlaylist, syncPlaylistAmount, usePlaylistStorage } from "../storage/playlist";
import useAddPlaylistStore from "../store/addPlaylist";
export default function Page() {
    const containerStyle = useToastContainerStyle();
    const toast = useToast();

    // 添加歌单
    const { playlistDetail, name } = useAddPlaylistStore(state => ({
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
                ListHeaderComponent={
                    <Pressable
                        gap="$1"
                        px="$5"
                        py="$3"
                        sx={COMMON_TOUCH_COLOR}
                        onPress={() => {
                            quickCreatePlaylist(name, playlistDetail ?? []);
                            toast.show({
                                placement: "top",
                                containerStyle,
                                render: ({ id }) => (
                                    <Toast nativeID={`toast-${id}`} action="success" variant="accent">
                                        <VStack space="xs">
                                            <ToastTitle>歌单创建成功</ToastTitle>
                                            <ToastDescription>{"新歌单的名称：" + name}</ToastDescription>
                                        </VStack>
                                    </Toast>
                                ),
                            });
                            router.back();
                        }}
                    >
                        <Box flexDirection="row" alignItems="center" gap="$3">
                            <MaterialIcons name="add" size={24} color="red" flex={0} />
                            <Text fontSize="$md" lineHeight={24} numberOfLines={1} ellipsizeMode="tail" flex={1}>
                                {name}
                            </Text>
                        </Box>
                        <Text ml="$9" fontSize="$sm" opacity={0.6} lineHeight={21}>
                            添加新的歌单
                        </Text>
                    </Pressable>
                }
                renderItem={item => {
                    return (
                        <PlaylistItem
                            item={item.item}
                            onPress={() => {
                                addToPlaylist(item.item.id, playlistDetail ?? []);
                                syncPlaylistAmount(item.item.id);
                                toast.show({
                                    placement: "top",
                                    containerStyle,
                                    render: ({ id }) => (
                                        <Toast nativeID={`toast-${id}`} action="success" variant="accent">
                                            <VStack space="xs">
                                                <ToastTitle>曲目添加成功</ToastTitle>
                                                <ToastDescription>{`已添加 ${playlistDetail?.length ?? 0} 首曲目到歌单`}</ToastDescription>
                                            </VStack>
                                        </Toast>
                                    ),
                                });
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
