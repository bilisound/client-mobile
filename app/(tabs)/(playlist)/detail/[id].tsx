import { Entypo, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Box, Text } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import Color from "color";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, useColorScheme, View } from "react-native";
import { useMMKVObject } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import { useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import EditAction from "~/components/EditAction";
import Empty from "~/components/Empty";
import SongItem from "~/components/SongItem";
import Button from "~/components/ui/Button";
import ButtonTitleBar from "~/components/ui/ButtonTitleBar";
import { createIcon } from "~/components/ui/utils/icon";
import useMultiSelect from "~/hooks/useMultiSelect";
import useTracks from "~/hooks/useTracks";
import {
    PLAYLIST_ITEM_KEY_PREFIX,
    PlaylistDetailRow,
    PlaylistMeta,
    playlistStorage,
    syncPlaylistAmount,
    usePlaylistOnQueue,
    usePlaylistStorage,
} from "~/storage/playlist";
import { getImageProxyUrl } from "~/utils/constant-helper";
import log from "~/utils/logger";
import { playlistToTracks } from "~/utils/track-data";

const IconPlay = createIcon(Ionicons, "play");

function extractAndProcessImgUrls(playlistDetails: PlaylistDetailRow[]) {
    const imgUrls = playlistDetails.map(detail => detail.imgUrl);
    return Array.from(new Set(imgUrls));
}

const HEADER_BASE_SIZE = 120;

const IconEditMeta = createIcon(Feather, "edit");
const IconEditingDone = createIcon(Entypo, "check");
const IconEditing = createIcon(MaterialCommunityIcons, "format-list-checks");

function ImagesGroup({ images: origImages }: { images: string[] }) {
    const images = origImages.map(image => getImageProxyUrl(image));
    if (images.length === 0) {
        return (
            <Box
                flex={0}
                flexBasis="auto"
                bg="$trueGray500"
                w={HEADER_BASE_SIZE}
                h={HEADER_BASE_SIZE}
                borderRadius="$xl"
            />
        );
    }
    if (images.length >= 1 && images.length <= 3) {
        return (
            <Box
                flex={0}
                flexBasis="auto"
                w={HEADER_BASE_SIZE}
                h={HEADER_BASE_SIZE}
                borderRadius="$xl"
                overflow="hidden"
            >
                <Image
                    source={images[0]}
                    style={{
                        width: HEADER_BASE_SIZE,
                        height: HEADER_BASE_SIZE,
                        objectFit: "cover",
                    }}
                />
            </Box>
        );
    }
    return (
        <Box flex={0} flexBasis="auto" w={HEADER_BASE_SIZE} h={HEADER_BASE_SIZE} borderRadius="$xl" overflow="hidden">
            <Box flexDirection="row">
                <Image
                    source={images[0]}
                    style={{
                        width: HEADER_BASE_SIZE / 2,
                        height: HEADER_BASE_SIZE / 2,
                        objectFit: "cover",
                    }}
                />
                <Image
                    source={images[1]}
                    style={{
                        width: HEADER_BASE_SIZE / 2,
                        height: HEADER_BASE_SIZE / 2,
                        objectFit: "cover",
                    }}
                />
            </Box>
            <Box flexDirection="row">
                <Image
                    source={images[2]}
                    style={{
                        width: HEADER_BASE_SIZE / 2,
                        height: HEADER_BASE_SIZE / 2,
                        objectFit: "cover",
                    }}
                />
                <Image
                    source={images[3]}
                    style={{
                        width: HEADER_BASE_SIZE / 2,
                        height: HEADER_BASE_SIZE / 2,
                        objectFit: "cover",
                    }}
                />
            </Box>
        </Box>
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
    return (
        <Box flexDirection="row" gap="$4" px="$4" pt="$4" pb="$6">
            <ImagesGroup images={images} />
            <Box flex={1}>
                <Text fontSize="$xl" fontWeight="700" lineHeight="$xl">
                    {meta.title}
                </Text>
                <Text opacity={0.6} mt="$2">{`${meta.amount} 首歌曲`}</Text>
                {showPlayButton && (
                    <Box flexDirection="row" marginTop="$5">
                        <Button Icon={IconPlay} rounded>
                            播放
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default function Page() {
    const { theme } = useStyles();
    const bgColor = theme.colorTokens.background;
    const colorMode = useColorScheme();
    const edgeInsets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [playlistMeta = []] = usePlaylistStorage();
    const [playlistDetail = [], setPlaylistDetail] = useMMKVObject<PlaylistDetailRow[]>(
        PLAYLIST_ITEM_KEY_PREFIX + id,
        playlistStorage,
    );
    const [playlistOnQueue = {}, setPlaylistOnQueue] = usePlaylistOnQueue();
    const activeTrack = useActiveTrack();

    const [contentHeight, setContentHeight] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const enableUnderLayerColor = contentHeight > viewHeight;

    const meta = playlistMeta.find(e => e.id === id);

    // 多选管理
    const { clear, toggle, selected, setAll, reverse } = useMultiSelect<number>();
    const [editing, setEditing] = useState(false);

    async function handleRequestPlay(index: number) {
        if (playlistOnQueue.value?.id === id && activeTrack) {
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
                onPress: () => {
                    setPlaylistDetail((prevValue = []) => {
                        Array.from(selected)
                            .sort((a, b) => b - a)
                            .forEach(e => {
                                prevValue.splice(e, 1);
                            });
                        return prevValue.concat();
                    });
                    clear();
                    if (playlistOnQueue.value?.id === id) {
                        setPlaylistOnQueue({});
                    }
                    syncPlaylistAmount(id!);
                },
            },
        ]);
    }, [clear, id, playlistOnQueue.value?.id, selected, setPlaylistDetail, setPlaylistOnQueue]);

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
                    <Box flex={1}>
                        <Empty title="暂无内容" action={null} />
                    </Box>
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
