import React, { useEffect } from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useRequest } from "ahooks";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import * as Linking from "expo-linking";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { v4 } from "uuid";
import { Box, Fab, Pressable, Text } from "@gluestack-ui/themed";
import { formatSecond } from "../../utils/misc";
import { getBilisoundMetadata, GetBilisoundMetadataResponse } from "../../api/bilisound";
import usePlayerStateStore from "../../store/playerState";
import useHistoryStore from "../../store/history";
import { handleTogglePlay } from "../../utils/player-control";
import VideoMeta from "../../components/VideoMeta";
import QuerySkeleton from "../../components/local/query/QuerySkeleton";
import { COMMON_FRAME_SOLID_BUTTON_STYLE, COMMON_TOUCH_COLOR, SCREEN_BREAKPOINTS } from "../../constants/style";
import { convertToHTTPS } from "../../utils/string";
import useCommonColors from "../../hooks/useCommonColors";
import CommonFrameNew from "../../components/CommonFrameNew";
import { BILIBILI_VIDEO_URL_PREFIX } from "../../constants/network";

interface ListEntryProps {
    isActiveTrack: boolean;
    isDownloaded: boolean;
    isCurrentRequesting: boolean;
    isPlaying: boolean;
    onRequestPlay: () => void;
    item: GetBilisoundMetadataResponse["pages"][number];
}

const ListEntry: React.FC<ListEntryProps> = ({
    isActiveTrack,
    isDownloaded,
    isCurrentRequesting,
    isPlaying,
    onRequestPlay,
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
                <Box
                    sx={{
                        flex: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        display: isActiveTrack ? "flex" : "none",
                    }}
                >
                    {isCurrentRequesting ? (
                        <ActivityIndicator color={accentColor} />
                    ) : (
                        <FontAwesome5 name={isPlaying ? "pause" : "play"} size={20} color={accentColor} />
                    )}
                </Box>
                {/* {downloadEntry ? (
                    <Box
                        sx={{
                            height: 3,
                            position: "absolute",
                            backgroundColor: "color-accent-default",
                            left: 0,
                            bottom: 0,
                            width: `${(downloadEntry.progress.totalBytesWritten / downloadEntry.progress.totalBytesExpectedToWrite) * 100}%`,
                        }}
                    />
                ) : null} */}
            </Box>
        </Pressable>
    );
};

const QueryIdScreen: React.FC = () => {
    const { id, noHistory } = useLocalSearchParams<{ id: string; noHistory?: string }>();
    // const navigation = useNavigation();
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();

    // 数据请求
    const { data, error, loading } = useRequest(getBilisoundMetadata, {
        defaultParams: [
            {
                id: `${id}`,
            },
        ],
    });

    // 增加历史记录条目
    const { appendHistoryList } = useHistoryStore((state) => ({
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
    }, [data]);

    // 播放列表
    const activeTrack = useActiveTrack();

    // 播放状态
    const { setPlayingRequest, playingRequest } = usePlayerStateStore((state) => ({
        setPlayingRequest: state.setPlayingRequest,
        playingRequest: state.playingRequest,
    }));

    // 播放列表渲染
    const playingState = usePlaybackState().state;
    const isPlaying = playingState === State.Playing;

    const renderItem = ({ item }: { item: GetBilisoundMetadataResponse["pages"][number] }) => {
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
                isPlaying={isPlaying}
                isCurrentRequesting={isCurrentRequesting}
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
    };

    const dataList = data?.data.pages ?? [];
    const dataLength = Math.max(dataList.length, 1);
    const activeTrackString = `${activeTrack?.bilisoundId}__${activeTrack?.bilisoundEpisode}`;
    const requestTrackString = `${playingRequest?.id}__${playingRequest?.episode}`;
    const updateTriggerString = `${activeTrackString}__${requestTrackString}__${isPlaying}__${!!activeTrack}`;

    return (
        <CommonFrameNew
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
                    keyExtractor={(item) => `${item.page}`}
                    ListHeaderComponent={data ? <VideoMeta meta={data.data} /> : <View />}
                    ListFooterComponent={<View style={{ height: edgeInsets.bottom + (activeTrack ? 58 + 36 : 0) }} />}
                    renderItem={renderItem}
                    estimatedItemSize={dataLength * 64}
                    ListEmptyComponent={<QuerySkeleton />}
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
        </CommonFrameNew>
    );
};

export default QueryIdScreen;
