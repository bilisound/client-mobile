import { MaterialIcons } from "@expo/vector-icons";
import { Toast, ToastDescription, ToastTitle, useToast } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

import CommonLayout from "~/components/CommonLayout";
import PlaylistItem from "~/components/PlaylistItem";
import Pressable from "~/components/ui/Pressable";
import useToastContainerStyle from "~/hooks/useToastContainerStyle";
import { addToPlaylist, quickCreatePlaylist, syncPlaylistAmount, usePlaylistStorage } from "~/storage/playlist";
import useApplyPlaylistStore from "~/store/apply-playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";

export default function Page() {
    const containerStyle = useToastContainerStyle();
    const toast = useToast();

    // 添加歌单
    const { playlistDetail, name } = useApplyPlaylistStore(state => ({
        playlistDetail: state.playlistDetail,
        name: state.name,
    }));

    // console.log(JSON.stringify(playlistDetail, null, 2));

    const [playlistStorage] = usePlaylistStorage();
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
                    <Pressable
                        style={[styles.pressable]}
                        onPress={() => {
                            quickCreatePlaylist(name, playlistDetail ?? []);
                            toast.show({
                                placement: "top",
                                containerStyle,
                                render: ({ id }) => (
                                    <Toast nativeID={`toast-${id}`} action="success" variant="accent">
                                        <View style={styles.toastContainer}>
                                            <ToastTitle>歌单创建成功</ToastTitle>
                                            <ToastDescription>{"新歌单的名称：" + name}</ToastDescription>
                                        </View>
                                    </Toast>
                                ),
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
                                            <View style={styles.toastContainer}>
                                                <ToastTitle>曲目添加成功</ToastTitle>
                                                <ToastDescription>{`已添加 ${playlistDetail?.length ?? 0} 首曲目到歌单`}</ToastDescription>
                                            </View>
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

const styles = StyleSheet.create({
    container: {
        gap: 16,
        paddingVertical: 16,
    },
    headerText: {
        paddingHorizontal: 20,
        fontWeight: "700",
        opacity: 0.6,
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
    },
    author: {
        fontSize: 14,
        opacity: 0.7,
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
    },
    pressableSubtext: {
        marginLeft: 36,
        fontSize: 14,
        opacity: 0.6,
        lineHeight: 21,
    },
    toastContainer: {
        gap: 4,
    },
});
