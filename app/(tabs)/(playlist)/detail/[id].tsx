import { Ionicons } from "@expo/vector-icons";
import { Box, Button, ButtonText, Text } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import Color from "color";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useColorScheme } from "react-native";
import { useMMKVStorage } from "react-native-mmkv-storage";
import TrackPlayer from "react-native-track-player";

import CommonLayout from "../../../../components/CommonLayout";
import SongItem from "../../../../components/SongItem";
import useCommonColors from "../../../../hooks/useCommonColors";
import {
    PLAYLIST_ITEM_KEY_PREFIX,
    PlaylistDetailRow,
    PlaylistMeta,
    playlistStorage,
    usePlaylistStorage,
} from "../../../../storage/playlist";
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

export default function Page() {
    const { bgColor } = useCommonColors();
    const colorMode = useColorScheme();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [playlistMeta] = usePlaylistStorage();
    const [playlistDetail] = useMMKVStorage<PlaylistDetailRow[]>(PLAYLIST_ITEM_KEY_PREFIX + id, playlistStorage, []);

    const [contentHeight, setContentHeight] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const enableUnderLayerColor = contentHeight > viewHeight;

    const meta = playlistMeta.find(e => e.id === id);

    async function handleRequestPlay(index: number) {
        const tracks = await playlistToTracks(playlistDetail);
        await TrackPlayer.setQueue(tracks);
        await TrackPlayer.skip(index);
    }

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
        </CommonLayout>
    );
}
