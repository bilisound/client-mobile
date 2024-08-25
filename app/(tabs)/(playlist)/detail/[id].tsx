import { Entypo, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Color from "color";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, useColorScheme, View, Text } from "react-native";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import { useStyles, createStyleSheet } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import EditAction from "~/components/EditAction";
import Empty from "~/components/Empty";
import SongItem from "~/components/SongItem";
import Button from "~/components/potato-ui/Button";
import ButtonTitleBar from "~/components/potato-ui/ButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import useMultiSelect from "~/hooks/useMultiSelect";
import { usePlaylistOnQueue } from "~/storage/playlist";
import {
    deletePlaylistDetail,
    getPlaylistDetail,
    getPlaylistMeta,
    syncPlaylistAmount,
} from "~/storage/sqlite/playlist";
import { PlaylistDetail, PlaylistMeta } from "~/storage/sqlite/schema";
import { getImageProxyUrl } from "~/utils/constant-helper";
import log from "~/utils/logger";
import { playlistToTracks } from "~/utils/track-data";

const IconPlay = createIcon(Ionicons, "play");

function extractAndProcessImgUrls(playlistDetails: PlaylistDetail[]) {
    const imgUrls = playlistDetails.map(detail => detail.imgUrl);
    return Array.from(new Set(imgUrls));
}

const HEADER_BASE_SIZE = 120;

const IconEditMeta = createIcon(Feather, "edit");
const IconEditingDone = createIcon(Entypo, "check");
const IconEditing = createIcon(MaterialCommunityIcons, "format-list-checks");

function ImagesGroup({ images: origImages }: { images: string[] }) {
    const { styles } = useStyles(stylesheet);
    const images = origImages.map(image => getImageProxyUrl(image));
    if (images.length === 0) {
        return <View style={[styles.imageGroupBase, styles.emptyImageGroup]} />;
    }
    if (images.length >= 1 && images.length <= 3) {
        return (
            <View style={styles.imageGroupBase}>
                <Image source={images[0]} style={styles.singleImage} />
            </View>
        );
    }
    return (
        <View style={styles.imageGroupBase}>
            <View style={styles.imageRow}>
                <Image source={images[0]} style={styles.quarterImage} />
                <Image source={images[1]} style={styles.quarterImage} />
            </View>
            <View style={styles.imageRow}>
                <Image source={images[2]} style={styles.quarterImage} />
                <Image source={images[3]} style={styles.quarterImage} />
            </View>
        </View>
    );
}

function Header({
    meta,
    images,
    onPlay,
    showPlayButton,
}: {
    meta: PlaylistMeta;
    images: string[];
    onPlay: () => void;
    showPlayButton: boolean;
}) {
    const { styles } = useStyles(stylesheet);
    return (
        <View style={styles.headerContainer}>
            <ImagesGroup images={images} />
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{meta.title}</Text>
                <Text style={styles.headerSubtitle}>{`${meta.amount} 首歌曲`}</Text>
                {showPlayButton && (
                    <View style={styles.playButtonContainer}>
                        <Button Icon={IconPlay} rounded onPress={onPlay}>
                            播放
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
}

export default function Page() {
    const { theme } = useStyles();
    const bgColor = theme.colorTokens.background;
    const colorMode = useColorScheme();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [playlistOnQueue = {}, setPlaylistOnQueue] = usePlaylistOnQueue();

    const { data: metaRaw } = useQuery({
        queryKey: [`playlist_meta_${id}`],
        queryFn: () => getPlaylistMeta(Number(id)),
    });

    const meta = metaRaw?.[0];

    const queryClient = useQueryClient();
    const { data: playlistDetail = [] } = useQuery({
        queryKey: [`playlist_detail_${id}`],
        queryFn: () => getPlaylistDetail(Number(id)),
    });

    const activeTrack = useActiveTrack();

    const [contentHeight, setContentHeight] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const enableUnderLayerColor = contentHeight > viewHeight;

    // 多选管理
    const { clear, toggle, selected, setAll, reverse } = useMultiSelect<number>();
    const [editing, setEditing] = useState(false);

    async function handleRequestPlay(index: number) {
        if (playlistOnQueue.value?.id === Number(id) && activeTrack) {
            log.debug("当前队列中的内容来自本歌单，就地跳转");
            await TrackPlayer.skip(index);
            return;
        }
        if (playlistOnQueue.value || (await TrackPlayer.getQueue()).length <= 0) {
            return handleRequestPlayConfirm(index);
        }
        Alert.alert(
            "替换播放队列确认",
            "播放本歌单中的歌曲，将会把当前播放队列替换为本歌单。确定要继续吗？",
            [
                {
                    text: "取消",
                    style: "cancel",
                },
                {
                    text: "确定",
                    isPreferred: true,
                    onPress() {
                        return handleRequestPlayConfirm(index);
                    },
                },
            ],
            {
                onDismiss() {},
            },
        );
    }

    async function handleRequestPlayConfirm(index: number) {
        log.debug("将队列中的内容设置为本歌单");
        const tracks = await playlistToTracks(playlistDetail);
        await TrackPlayer.pause();
        await TrackPlayer.setQueue(tracks);
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
        setPlaylistOnQueue({ value: meta });
    }

    const handleDelete = useCallback(() => {
        Alert.alert("删除曲目确认", `确定要从本歌单中删除 ${selected.size} 首曲目吗？`, [
            {
                text: "取消",
                style: "cancel",
            },
            {
                text: "确定",
                style: "default",
                onPress: async () => {
                    // 注意，这里的 selected 是数组的 index，不是项目在数据库中的 id！！
                    for (const e of selected) {
                        await deletePlaylistDetail(playlistDetail[e].id);
                    }
                    await syncPlaylistAmount(Number(id));
                    await Promise.all([
                        queryClient.invalidateQueries({ queryKey: ["playlist_meta"] }),
                        queryClient.invalidateQueries({ queryKey: [`playlist_meta_${id}`] }),
                        queryClient.invalidateQueries({ queryKey: [`playlist_detail_${id}`] }),
                    ]);
                    if (playlistOnQueue.value?.id === Number(id)) {
                        setPlaylistOnQueue(undefined);
                    }
                    clear();
                },
            },
        ]);
    }, [clear, id, playlistDetail, playlistOnQueue.value?.id, queryClient, selected, setPlaylistOnQueue]);

    // 返回时先关闭编辑模式
    const navigation = useNavigation();
    useEffect(() => {
        const handler = (e: any) => {
            if (!editing) {
                return;
            }
            e.preventDefault();
            setEditing(false);
            navigation.removeListener("beforeRemove", handler);
        };
        if (editing) {
            navigation.addListener("beforeRemove", handler);
        }
        return () => {
            navigation.removeListener("beforeRemove", handler);
        };
    }, [editing, navigation]);

    if (!meta) {
        return null;
    }

    const fromColor = Color(meta.color)
        .lightness(colorMode === "dark" ? 20 : 95)
        .saturationl(100)
        .toString();

    return (
        <CommonLayout
            title="查看详情"
            titleBarTheme="transparentAlt"
            containerStyle={{
                backgroundColor: enableUnderLayerColor ? fromColor : bgColor,
            }}
            titleBarStyle={{
                backgroundColor: fromColor,
            }}
            leftAccessories="backButton"
            rightAccessories={
                <>
                    <ButtonTitleBar
                        label="编辑歌单信息"
                        onPress={() => {
                            router.push(`../meta/${id}`);
                        }}
                        Icon={IconEditMeta}
                        iconSize={20}
                        theme="transparentAlt"
                    />
                    {playlistDetail.length > 0 ? (
                        <ButtonTitleBar
                            label={editing ? "完成" : "编辑"}
                            onPress={() =>
                                setEditing(prevState => {
                                    if (prevState) {
                                        clear();
                                    }
                                    return !prevState;
                                })
                            }
                            Icon={editing ? IconEditingDone : IconEditing}
                            theme="transparentAlt"
                        />
                    ) : null}
                </>
            }
            extendToBottom
        >
            <FlashList
                renderItem={item => {
                    return (
                        <SongItem
                            data={item.item}
                            index={item.index + 1}
                            onRequestPlay={() => {
                                handleRequestPlay(item.index);
                            }}
                            onToggle={() => {
                                toggle(item.index);
                            }}
                            isChecking={editing}
                            isChecked={selected.has(item.index)}
                        />
                    );
                }}
                data={playlistDetail}
                estimatedItemSize={68}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    setContentHeight(contentHeight);
                }}
                onLayout={({
                    nativeEvent: {
                        layout: { height },
                    },
                }) => {
                    setViewHeight(height);
                }}
                contentContainerStyle={{
                    backgroundColor: bgColor,
                }}
                extraData={[editing, selected.size]}
                ListHeaderComponent={
                    <LinearGradient
                        colors={[fromColor, bgColor]}
                        start={{ x: 0, y: 0.2 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            width: "100%",
                        }}
                        aria-hidden
                    >
                        <Header
                            meta={meta}
                            images={extractAndProcessImgUrls(playlistDetail)}
                            showPlayButton={playlistDetail.length > 0}
                            onPlay={() => {
                                handleRequestPlay(0);
                            }}
                        />
                    </LinearGradient>
                }
                ListEmptyComponent={
                    <View style={{ flex: 1 }}>
                        <Empty title="暂无内容" action={null} />
                    </View>
                }
            />
            {editing ? (
                <EditAction
                    onAll={() => {
                        setAll(new Array(playlistDetail.length).fill(0).map((_, i) => i));
                    }}
                    onReverse={() => {
                        reverse(new Array(playlistDetail.length).fill(0).map((_, i) => i));
                    }}
                    onDelete={() => {
                        handleDelete();
                    }}
                    amount={selected.size}
                />
            ) : null}
        </CommonLayout>
    );
}

const stylesheet = createStyleSheet(theme => ({
    imageGroupBase: {
        flex: 0,
        flexBasis: "auto",
        width: HEADER_BASE_SIZE,
        height: HEADER_BASE_SIZE,
        borderRadius: 12,
        overflow: "hidden",
    },
    emptyImageGroup: {
        backgroundColor: "$trueGray500",
    },
    singleImage: {
        width: HEADER_BASE_SIZE,
        height: HEADER_BASE_SIZE,
        objectFit: "cover",
    },
    imageRow: {
        flexDirection: "row",
    },
    quarterImage: {
        width: HEADER_BASE_SIZE / 2,
        height: HEADER_BASE_SIZE / 2,
        objectFit: "cover",
    },
    headerContainer: {
        flexDirection: "row",
        gap: 16,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 20 * 1.5,
        color: theme.colorTokens.foreground,
    },
    headerSubtitle: {
        opacity: 0.6,
        marginTop: 8,
        fontSize: 14,
        lineHeight: 14 * 1.5,
        color: theme.colorTokens.foreground,
    },
    playButtonContainer: {
        flexDirection: "row",
        marginTop: 20,
    },
}));
