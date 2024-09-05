import { Entypo, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Color from "color";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, useColorScheme, Vibration, View } from "react-native";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import { useStyles, createStyleSheet } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import EditAction from "~/components/EditAction";
import Empty from "~/components/Empty";
import SongItem from "~/components/SongItem";
import PotatoButton from "~/components/potato-ui/PotatoButton";
import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
} from "~/components/ui/actionsheet";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import useMultiSelect from "~/hooks/useMultiSelect";
import { invalidateOnQueueStatus, PLAYLIST_ON_QUEUE, playlistStorage, usePlaylistOnQueue } from "~/storage/playlist";
import {
    deletePlaylistDetail,
    deletePlaylistMeta,
    getPlaylistDetail,
    getPlaylistMeta,
    syncPlaylistAmount,
} from "~/storage/sqlite/playlist";
import { PlaylistDetail, PlaylistMeta } from "~/storage/sqlite/schema";
import { getImageProxyUrl } from "~/utils/constant-helper";
import { exportPlaylistToFile } from "~/utils/exchange/playlist";
import log from "~/utils/logger";
import { playlistToTracks } from "~/utils/track-data";

const IconPlay = createIcon(Ionicons, "play");
const IconMenu = createIcon(Entypo, "dots-three-vertical");

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
        <View style={styles.headerContainerOuter}>
            <View style={styles.headerContainer}>
                <ImagesGroup images={images} />
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{meta.title}</Text>
                    <Text style={styles.headerSubtitle}>{`${meta.amount} 首歌曲`}</Text>
                    {showPlayButton && (
                        <View style={styles.playButtonContainer}>
                            <PotatoButton Icon={IconPlay} rounded onPress={onPlay}>
                                播放
                            </PotatoButton>
                        </View>
                    )}
                </View>
            </View>
            {(meta.description ?? "").trim() && (
                <Text style={styles.headerDescription} selectable>
                    {meta.description}
                </Text>
            )}
        </View>
    );
}

export default function Page() {
    const { theme } = useStyles();
    const bgColor = theme.colorTokens.background;
    const colorMode = useColorScheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const textBasicColor = theme.colorTokens.foreground;

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
        // 前提条件：
        // playlistOnQueue 的 id 是这个歌单的 id
        // 有 activeTrack
        // 当前 queue 对应 index 的 bvid 和 episode 与请求播放的一致
        const from = (await TrackPlayer.getQueue())[index];
        const to = playlistDetail[index];
        if (
            playlistOnQueue.value?.id === Number(id) &&
            activeTrack &&
            from.bilisoundId === to.bvid &&
            from.bilisoundEpisode === to.episode
        ) {
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

    // 菜单
    const [showActionMenu, setShowActionMenu] = useState(false);

    // 删除操作
    function handleWholeDelete() {
        Alert.alert("删除歌单确认", `确定要删除歌单「${meta?.title}」吗？`, [
            {
                text: "取消",
                style: "cancel",
            },
            {
                text: "确定",
                style: "default",
                onPress: async () => {
                    log.info(`用户删除歌单「${meta?.title}」`);
                    router.replace("..");
                    await deletePlaylistMeta(Number(id));
                    await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });

                    // 清空当前播放队列隶属歌单的状态机
                    const got: { value?: PlaylistMeta } = JSON.parse(
                        playlistStorage.getString(PLAYLIST_ON_QUEUE) || "{}",
                    );
                    if (got?.value?.id === Number(id)) {
                        invalidateOnQueueStatus();
                    }
                },
            },
        ]);
    }

    // ！！Hook 部分结束！！

    if (!meta) {
        return null;
    }

    const fromColor = Color(meta.color)
        .lightness(colorMode === "dark" ? 12 : 95)
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
                    {playlistDetail.length > 0 ? (
                        <PotatoButtonTitleBar
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
                    <PotatoButtonTitleBar
                        label="操作"
                        onPress={() => {
                            setShowActionMenu(true);
                        }}
                        Icon={IconMenu}
                        iconSize={18}
                        theme="transparentAlt"
                    />
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
                            onLongPress={() => {
                                if (!editing) {
                                    Vibration.vibrate(25);
                                    setEditing(true);
                                    toggle(item.index);
                                }
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
            <Actionsheet isOpen={showActionMenu} onClose={() => setShowActionMenu(false)}>
                <ActionsheetBackdrop />
                <ActionsheetContent className="z-50">
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>
                    <Box className="items-start w-full px-4 py-4 gap-1">
                        <Text className="font-bold">{meta.title}</Text>
                        <Text className="text-sm opacity-60">{`${meta.amount} 首歌曲`}</Text>
                    </Box>
                    <ActionsheetItem
                        onPress={() => {
                            setShowActionMenu(false);
                            router.push(`../meta/${id}`);
                        }}
                    >
                        <Box
                            style={{
                                width: 24,
                                height: 24,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MaterialIcons name="edit" size={24} color={textBasicColor} />
                        </Box>
                        <ActionsheetItemText>修改信息</ActionsheetItemText>
                    </ActionsheetItem>
                    <ActionsheetItem
                        onPress={() => {
                            setShowActionMenu(false);
                            handleWholeDelete();
                        }}
                    >
                        <Box
                            style={{
                                width: 24,
                                height: 24,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MaterialIcons name="delete" size={24} color={textBasicColor} />
                        </Box>
                        <ActionsheetItemText>删除</ActionsheetItemText>
                    </ActionsheetItem>
                    <ActionsheetItem
                        onPress={() => {
                            setShowActionMenu(false);
                            exportPlaylistToFile(Number(id));
                        }}
                    >
                        <Box
                            style={{
                                width: 24,
                                height: 24,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Ionicons name="save" size={20} color={textBasicColor} />
                        </Box>
                        <ActionsheetItemText>导出</ActionsheetItemText>
                    </ActionsheetItem>
                    <ActionsheetItem
                        onPress={() => {
                            setShowActionMenu(false);
                        }}
                    >
                        <Box
                            style={{
                                width: 24,
                                height: 24,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MaterialIcons name="cancel" size={22} color={textBasicColor} />
                        </Box>
                        <ActionsheetItemText>取消</ActionsheetItemText>
                    </ActionsheetItem>
                </ActionsheetContent>
            </Actionsheet>
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
        backgroundColor: theme.colors.neutral[500],
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
    headerContainerOuter: {
        paddingBottom: 24,
        paddingHorizontal: 16,
        gap: 24,
    },
    headerContainer: {
        flexDirection: "row",
        paddingTop: 16,
        gap: 16,
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
    headerDescription: {
        fontSize: 14,
        lineHeight: 14 * 1.5,
        color: theme.colorTokens.foreground,
        opacity: 0.8,
        paddingBottom: 8,
    },
}));
