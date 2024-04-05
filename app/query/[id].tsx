import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Box, Fab, Pressable, Text } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { Fragment, memo, useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { v4 } from "uuid";

import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "../../api/bilisound";
import CommonLayout from "../../components/CommonLayout";
import VideoMeta from "../../components/VideoMeta";
import VideoSkeleton from "../../components/VideoSkeleton";
import { BILIBILI_VIDEO_URL_PREFIX } from "../../constants/network";
import { COMMON_FRAME_SOLID_BUTTON_STYLE, COMMON_TOUCH_COLOR, SCREEN_BREAKPOINTS } from "../../constants/style";
import useCommonColors from "../../hooks/useCommonColors";
import useDownloadStore from "../../store/download";
import useHistoryStore from "../../store/history";
import usePlayerStateStore from "../../store/playerState";
import { formatSecond } from "../../utils/misc";
import { handleTogglePlay } from "../../utils/player-control";
import { convertToHTTPS } from "../../utils/string";

// 加载进度条
function ProgressBar({ item }: { item: string }) {
    const { downloadList } = useDownloadStore(state => ({
        downloadList: state.downloadList,
    }));
    const downloadEntry = downloadList.get(item);
    const { accentColor } = useCommonColors();

    if (!downloadEntry) {
        return null;
    }

    return (
        <Box
            sx={{
                height: 3,
                position: "absolute",
                backgroundColor: accentColor,
                left: 0,
                bottom: 0,
                width: `${(downloadEntry.progress.bytesWritten / downloadEntry.progress.contentLength) * 100}%`,
            }}
        />
    );
}

// 播放状态图标
function PlayingIcon() {
    const playingState = usePlaybackState().state;
    const isPlaying = playingState === State.Playing;
    const { accentColor } = useCommonColors();

    return <FontAwesome5 name={isPlaying ? "pause" : "play"} size={20} color={accentColor} />;
}

interface ListEntryProps {
    isActiveTrack: boolean;
    isDownloaded: boolean;
    isCurrentRequesting: boolean;
    onRequestPlay: () => void;
    belongId: string;
    item: GetBilisoundMetadataResponse["pages"][number];
}

// 列表项目
const ListEntryRaw: React.FC<ListEntryProps> = ({
    isActiveTrack,
    isDownloaded,
    isCurrentRequesting,
    onRequestPlay,
    belongId,
    item,
}) => {
    const { width } = useWindowDimensions();
    const { textBasicColor, accentColor } = useCommonColors();

    return (
        <Pressable
            sx={COMMON_TOUCH_COLOR}
            onPress={async () => {
                if (isActiveTrack) {
                    await handleTogglePlay();
                    return;
                }
                if (!isCurrentRequesting) {
                    onRequestPlay();
                }
            }}
            onLongPress={() => null}
        >
            <Box
                sx={{
                    paddingHorizontal: width >= SCREEN_BREAKPOINTS.md ? 24 : 16,
                    height: 64,
                    flexDirection: "row",
                    gap: 10,
                    position: "relative",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        flexDirection: "row",
                        flex: 1,
                        gap: 10,
                        justifyContent: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: isActiveTrack ? "$accent500" : "$primary500",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 6,
                            paddingRight: 6,
                            height: 22,
                            borderRadius: 6,
                            flex: 0,
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "$white",
                            }}
                        >
                            {item.page}
                        </Text>
                    </Box>
                    <Box flex={1}>
                        <Text
                            sx={{
                                lineHeight: 22,
                                fontSize: 14,
                                fontWeight: isActiveTrack ? "700" : "400",
                                color: isActiveTrack ? "$accent500" : textBasicColor,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.part}
                        </Text>
                        <Box
                            sx={{
                                marginTop: 4,
                                gap: 4,
                                flexDirection: "row",
                                alignItems: "center",
                                opacity: 0.5,
                            }}
                        >
                            {isDownloaded ? (
                                <Ionicons name="checkmark-circle" size={14} color={textBasicColor} />
                            ) : null}
                            <Text
                                sx={{
                                    fontSize: 14,
                                }}
                            >
                                {formatSecond(item.duration)}
                            </Text>
                        </Box>
                    </Box>
                </Box>
                {isActiveTrack ? (
                    <>
                        <Box
                            sx={{
                                flex: 0,
                                alignItems: "center",
                                justifyContent: "center",
                                width: 32,
                            }}
                        >
                            {isCurrentRequesting ? <ActivityIndicator color={accentColor} /> : <PlayingIcon />}
                        </Box>
                        {isCurrentRequesting ? <ProgressBar item={`${belongId}_${item.page}`} /> : null}
                    </>
                ) : null}
            </Box>
        </Pressable>
    );
};

const ListEntry = memo(ListEntryRaw, (a, b) => {
    return (
        a.isActiveTrack === b.isActiveTrack &&
        a.isDownloaded === b.isDownloaded &&
        a.isCurrentRequesting === b.isCurrentRequesting &&
        a.item === b.item &&
        a.belongId === b.belongId
    );
});

const QueryIdScreen: React.FC = () => {
    const renderingTime = useRef(0);
    console.log("TabPlaying 被渲染", renderingTime.current++);

    const { id, noHistory } = useLocalSearchParams<{ id: string; noHistory?: string }>();
    // const navigation = useNavigation();
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();

    // 数据请求
    const { data, error } = useQuery({
        queryKey: [id],
        queryFn: () => getBilisoundMetadata({ id }),
    });

    // 增加历史记录条目
    const { appendHistoryList } = useHistoryStore(state => ({
        appendHistoryList: state.appendHistoryList,
    }));

    useEffect(() => {
        if (data && !noHistory) {
            appendHistoryList({
                authorName: data.data.owner.name,
                id: data.data.bvid,
                name: data.data.title,
                thumbnailUrl: convertToHTTPS(data.data.pic),
                visitedAt: new Date(),
                key: v4(),
            });
        }
    }, [appendHistoryList, data, noHistory]);

    // 播放列表
    const activeTrack = useActiveTrack();

    // 播放状态
    const { setPlayingRequest, playingRequest } = usePlayerStateStore(state => ({
        setPlayingRequest: state.setPlayingRequest,
        playingRequest: state.playingRequest,
    }));

    // 播放列表渲染
    const renderItem = useCallback(
        ({ item }: { item: GetBilisoundMetadataResponse["pages"][number] }) => {
            const rootData = data!.data;
            const isActiveTrackMatch =
                activeTrack?.bilisoundId === rootData.bvid && activeTrack?.bilisoundEpisode === item.page;
            const isRequestTrackMatch = playingRequest?.id === rootData.bvid && playingRequest?.episode === item.page;
            const isCurrentRequesting = !!playingRequest;

            let isActiveTrack = false;
            // 可能存在的情况：请求的曲目发生变化，但是当前活动的曲目没有变化
            if (isActiveTrackMatch && !isCurrentRequesting) {
                isActiveTrack = true;
            }
            if (isRequestTrackMatch) {
                isActiveTrack = true;
            }

            return (
                <ListEntry
                    isDownloaded={false}
                    isActiveTrack={isActiveTrack}
                    isCurrentRequesting={isCurrentRequesting}
                    belongId={rootData.bvid}
                    onRequestPlay={() => {
                        if (playingRequest) {
                            return;
                        }
                        setPlayingRequest({
                            id: rootData.bvid,
                            episode: item.page,
                            artist: data!.data.owner.name,
                            artwork: data!.data.pic,
                            duration: item.duration,
                            title: item.part,
                        });
                    }}
                    item={item}
                />
            );
        },
        [activeTrack, data, playingRequest, setPlayingRequest],
    );

    const dataList = data?.data.pages ?? [];
    const dataLength = Math.max(dataList.length, 1);
    const activeTrackString = `${activeTrack?.bilisoundId}__${activeTrack?.bilisoundEpisode}`;
    const requestTrackString = `${playingRequest?.id}__${playingRequest?.episode}`;
    const updateTriggerString = `${activeTrackString}__${requestTrackString}__${!!activeTrack}`;

    return (
        <CommonLayout
            title="查看详情"
            extendToBottom
            leftAccessories={
                <Pressable sx={COMMON_FRAME_SOLID_BUTTON_STYLE} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
            }
            rightAccessories={
                <Pressable
                    sx={COMMON_FRAME_SOLID_BUTTON_STYLE}
                    onPress={async () => {
                        await Linking.openURL(`${BILIBILI_VIDEO_URL_PREFIX}${data?.data.bvid}`);
                    }}
                >
                    <FontAwesome5 name="share" size={16} color="#fff" />
                </Pressable>
            }
        >
            {error ? (
                <Box
                    sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        opacity: 0.5,
                    }}
                >
                    <MaterialIcons name="error-outline" size={72} color={textBasicColor} />
                    <Text sx={{ fontSize: 20, fontWeight: "700" }}>查询失败了</Text>
                    <Text sx={{ fontSize: 14 }}>{`${error?.message || error}`}</Text>
                </Box>
            ) : (
                <FlashList
                    data={dataList}
                    extraData={updateTriggerString}
                    keyExtractor={item => `${item.page}`}
                    ListHeaderComponent={data ? <VideoMeta meta={data.data} /> : <View />}
                    ListFooterComponent={<View style={{ height: edgeInsets.bottom + (activeTrack ? 58 + 36 : 0) }} />}
                    renderItem={renderItem}
                    estimatedItemSize={dataLength * 64}
                    ListEmptyComponent={<VideoSkeleton />}
                />
            )}
            {activeTrack ? (
                <Fab
                    size="lg"
                    isHovered={false}
                    isDisabled={false}
                    isPressed={false}
                    right={edgeInsets.right + 24}
                    bottom={edgeInsets.bottom + 24}
                    onPress={() => router.push("/modal")}
                >
                    <FontAwesome5 name="headphones" size={24} color="#fff" />
                </Fab>
            ) : null}
        </CommonLayout>
    );
};

export default QueryIdScreen;
