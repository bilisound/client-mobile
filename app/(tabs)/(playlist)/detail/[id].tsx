import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Box, Button, ButtonText, Pressable, Text } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import Color from "color";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import { useMMKVStorage } from "react-native-mmkv-storage";
import TrackPlayer from "react-native-track-player";

import CommonLayout from "../../../../components/CommonLayout";
import SongItem from "../../../../components/SongItem";
import { COMMON_FRAME_BUTTON_STYLE } from "../../../../constants/style";
import useCommonColors from "../../../../hooks/useCommonColors";
import useMultiSelect from "../../../../hooks/useMultiSelect";
import {
    PLAYLIST_ITEM_KEY_PREFIX,
    PlaylistDetailRow,
    PlaylistMeta,
    playlistStorage,
    syncPlaylistAmount,
    usePlaylistOnQueue,
    usePlaylistStorage,
} from "../../../../storage/playlist";
import log from "../../../../utils/logger";
import { playlistToTracks } from "../../../../utils/track-data";

function extractAndProcessImgUrls(playlistDetails: PlaylistDetailRow[]) {
    const imgUrls = playlistDetails.map(detail => detail.imgUrl);
    return Array.from(new Set(imgUrls));
}

const HEADER_BASE_SIZE = 120;

function ImagesGroup({ images }: { images: string[] }) {
    if (images.length === 0) {
        return <Box flex={0} bg="$trueGray500" w={HEADER_BASE_SIZE} h={HEADER_BASE_SIZE} borderRadius="$xl" />;
    }
    if (images.length >= 1 && images.length <= 3) {
        return (
            <Box flex={0} w={HEADER_BASE_SIZE} h={HEADER_BASE_SIZE} borderRadius="$xl" overflow="hidden">
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
        <Box flex={0} w={HEADER_BASE_SIZE} h={HEADER_BASE_SIZE} borderRadius="$xl" overflow="hidden">
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
                    <Box flexDirection="row">
                        <Button
                            mt="$5"
                            rounded="$full"
                            size="md"
                            variant="solid"
                            action="primary"
                            isDisabled={false}
                            isFocusVisible={false}
                            onPress={onPlay}
                        >
                            <Ionicons name="play" size={20} color="white" />
                            <ButtonText> 播放</ButtonText>
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

interface EditActionProps {
    onAll: () => void;
    onReverse: () => void;
    onDelete: () => void;
    amount: number;
}

function EditAction({ onAll, onReverse, onDelete, amount }: EditActionProps) {
    const { bgColor } = useCommonColors();

    return (
        <Box
            sx={{
                borderWidth: 1,
                borderColor: "$backgroundLight100",
                _dark: {
                    borderColor: "$backgroundDark900",
                },
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                flex: 0,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: 52,
                px: 12,
                bg: bgColor,
            }}
        >
            <Text>{`已选择 ${amount} 项`}</Text>
            <Box flexDirection="row" gap="$2">
                <Button size="sm" variant="outline" action="primary" onPress={onAll}>
                    <ButtonText>全选</ButtonText>
                </Button>
                <Button size="sm" variant="outline" action="primary" onPress={onReverse}>
                    <ButtonText>反选</ButtonText>
                </Button>
                <Button size="sm" action="negative" isDisabled={amount <= 0} onPress={onDelete}>
                    <ButtonText>删除</ButtonText>
                </Button>
            </Box>
        </Box>
    );
}

export default function Page() {
    const { bgColor, textBasicColor } = useCommonColors();
    const colorMode = useColorScheme();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [playlistMeta] = usePlaylistStorage();
    const [playlistDetail, setPlaylistDetail] = useMMKVStorage<PlaylistDetailRow[]>(
        PLAYLIST_ITEM_KEY_PREFIX + id,
        playlistStorage,
        [],
    );
    const [playlistOnQueue, setPlaylistOnQueue] = usePlaylistOnQueue();

    const [contentHeight, setContentHeight] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const enableUnderLayerColor = contentHeight > viewHeight;

    const meta = playlistMeta.find(e => e.id === id);

    // 多选管理
    const { clear, toggle, selected, setAll, reverse } = useMultiSelect<number>();
    const [editing, setEditing] = useState(false);

    async function handleRequestPlay(index: number) {
        if (playlistOnQueue?.id === id) {
            log.debug("当前队列中的内容来自本播放列表，就地跳转");
            await TrackPlayer.skip(index);
            return;
        }
        log.debug("将队列中的内容设置为本播放列表");
        const tracks = await playlistToTracks(playlistDetail);
        await TrackPlayer.pause();
        await TrackPlayer.setQueue(tracks);
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
        setPlaylistOnQueue(meta);
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
                    setPlaylistDetail(prevValue => {
                        Array.from(selected)
                            .sort((a, b) => b - a)
                            .forEach(e => {
                                prevValue.splice(e, 1);
                            });
                        return prevValue.concat();
                    });
                    clear();
                    if (playlistOnQueue?.id === id) {
                        setPlaylistOnQueue(undefined);
                    }
                    syncPlaylistAmount(id);
                },
            },
        ]);
    }, [clear, id, playlistOnQueue?.id, selected, setPlaylistDetail, setPlaylistOnQueue]);

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
            solidColor={fromColor}
            solidScheme={colorMode as "light" | "dark"}
            bgColor={enableUnderLayerColor ? fromColor : bgColor}
            leftAccessories="backButton"
            rightAccessories={
                playlistDetail.length > 0 ? (
                    <Pressable
                        aria-label={editing ? "完成" : "编辑"}
                        sx={COMMON_FRAME_BUTTON_STYLE}
                        onPress={() =>
                            setEditing(prevState => {
                                if (prevState) {
                                    clear();
                                }
                                return !prevState;
                            })
                        }
                    >
                        {editing ? (
                            <Entypo name="check" size={24} color={textBasicColor} />
                        ) : (
                            <MaterialCommunityIcons name="format-list-checks" size={24} color={textBasicColor} />
                        )}
                    </Pressable>
                ) : null
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
                ListEmptyComponent={<Text h="100%">暂无内容</Text>}
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
