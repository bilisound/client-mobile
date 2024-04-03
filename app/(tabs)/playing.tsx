import { Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    Box,
    Button,
    ButtonIcon,
    ButtonText,
    Checkbox,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
    CheckIcon,
    Pressable,
    Text,
} from "@gluestack-ui/themed";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { memo, useCallback, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, { State, Track, useActiveTrack, usePlaybackState } from "react-native-track-player";
import { remove } from "react-native-track-player/src/trackPlayer";

import CommonFrameNew from "../../components/CommonFrameNew";
import { COMMON_FRAME_BUTTON_STYLE, COMMON_TOUCH_COLOR } from "../../constants/style";
import useCommonColors from "../../hooks/useCommonColors";
import useTracks from "../../hooks/useTracks";
import useSettingsStore from "../../store/settings";
import { getFileName } from "../../utils/format";
import log from "../../utils/logger";
import { formatSecond, saveFile } from "../../utils/misc";
import { handleTogglePlay } from "../../utils/player-control";

// 播放状态图标
function PlayingIndicator() {
    const playbackState = usePlaybackState();
    const { accentColor } = useCommonColors();

    return (
        <FontAwesome5 name={playbackState.state === State.Playing ? "pause" : "play"} size={16} color={accentColor} />
    );
}

interface PlayListItemProps {
    index: number;
    item: Track;
    isThisSong: boolean;
    isEditing: boolean;
    isSelected: boolean;
    trackNumberWidth: number;
    onPress: () => void;
    onLongPress: () => void;
    onSelectToggle: () => void;
}

// 播放列表项目
function PlayListItemRaw({
    index,
    item,
    isThisSong,
    isEditing,
    isSelected,
    trackNumberWidth,
    onPress,
    onLongPress,
    onSelectToggle,
}: PlayListItemProps) {
    const selectCheckbox = (
        <Checkbox
            value=""
            size="md"
            isInvalid={false}
            isDisabled={false}
            isChecked={isSelected}
            onChange={() => onSelectToggle()}
            aria-label={`选择播放项目 ${item.title}`}
        >
            <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
        </Checkbox>
    );

    const indexIndicator = isThisSong ? (
        <PlayingIndicator />
    ) : (
        <Text
            style={{
                opacity: 0.45,
                fontWeight: "bold",
                fontSize: 15,
            }}
        >
            {index + 1}
        </Text>
    );

    return (
        <Pressable
            sx={{
                ...COMMON_TOUCH_COLOR,
            }}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <Box
                sx={{
                    height: 56,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: "$5",
                    gap: "$4",
                }}
            >
                <Box
                    sx={{
                        alignItems: isEditing ? "flex-start" : "center",
                        justifyContent: "center",
                        width: trackNumberWidth,
                    }}
                >
                    {isEditing ? selectCheckbox : indexIndicator}
                </Box>
                <Text
                    sx={{
                        flex: 1,
                        fontSize: 15,
                        fontWeight: isThisSong ? "700" : "400",
                        color: isThisSong ? "$accent500" : "$textLight700",
                        _dark: {
                            color: isThisSong ? "$accent500" : "$textDark200",
                        },
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {`${item.title}`}
                </Text>
                <Text
                    sx={{
                        flex: 0,
                        opacity: 0.45,
                        fontSize: 15,
                    }}
                >
                    {formatSecond(item.duration ?? 0)}
                </Text>
            </Box>
        </Pressable>
    );
}

const PlayListItem = memo(PlayListItemRaw, (a, b) => {
    return (
        a.index === b.index &&
        a.item === b.item &&
        a.isThisSong === b.isThisSong &&
        a.isEditing === b.isEditing &&
        a.isSelected === b.isSelected &&
        a.trackNumberWidth === b.trackNumberWidth
    );
});

const iconWrapperStyle = {
    w: 24,
    h: 24,
    alignItems: "center",
    justifyContent: "center",
};

interface LongPressActionsProps {
    showActionSheet: boolean;
    displayTrack?: Track | null;
    onClose: () => void;
    onAction: (action: "delete" | "export" | "close") => void;
}

function LongPressActionsRaw({ showActionSheet, displayTrack, onAction, onClose }: LongPressActionsProps) {
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent zIndex={999} pb={edgeInsets.bottom}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {displayTrack ? (
                    <Pressable
                        w="100%"
                        px="$5"
                        py="$2"
                        my="$2"
                        flexDirection="row"
                        gap="$4"
                        onPress={() => {
                            router.push(`/query/${displayTrack.bilisoundId}`);
                            onAction("close");
                        }}
                    >
                        <Image
                            source={displayTrack.artwork}
                            style={{
                                height: 48,
                                aspectRatio: "16/9",
                                flex: 0,
                                borderRadius: 8,
                            }}
                        />
                        <Box flex={1} gap="$1">
                            <Text numberOfLines={1} ellipsizeMode="tail" fontSize={16} fontWeight="700">
                                {displayTrack.title}
                            </Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" fontSize={14} opacity={0.7}>
                                {displayTrack.artist}
                            </Text>
                        </Box>
                    </Pressable>
                ) : null}
                <ActionsheetItem onPress={() => onAction("delete")}>
                    <Box sx={iconWrapperStyle}>
                        <MaterialIcons name="delete" size={24} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>从播放列表删除</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("export")}>
                    <Box sx={iconWrapperStyle}>
                        <Ionicons name="save" size={18} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>导出音频文件</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("close")}>
                    <Box sx={iconWrapperStyle}>
                        <MaterialIcons name="cancel" size={22} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>取消</ActionsheetItemText>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    );
}

const LongPressActions = memo(LongPressActionsRaw);

const TabPlaying: React.FC = () => {
    const renderingTime = useRef(0);
    console.log("TabPlaying 被渲染", renderingTime.current++);

    const activeTrack = useActiveTrack();
    const colorScheme = useColorScheme();
    const { primaryColor } = useCommonColors();
    const { tracks, update } = useTracks();
    const { useLegacyID } = useSettingsStore(state => ({
        useLegacyID: state.useLegacyID,
    }));

    // 菜单操作
    const currentOperateIndex = useRef(-1);
    const [showActionSheet, setShowActionSheet] = React.useState(false);
    const [displayTrack, setDisplayTrack] = useState<Track | null>(null);

    const handleClose = () => setShowActionSheet(prevState => !prevState);

    const handleDelete = useCallback(async () => {
        await remove(currentOperateIndex.current);
        await update();
        handleClose();
    }, [update]);

    const handleExport = useCallback(async () => {
        const track = await TrackPlayer.getTrack(currentOperateIndex.current);
        if (!track) {
            log.error(
                `导出失败，参数异常。track: ${track}, currentOperateIndex.current: ${currentOperateIndex.current}`,
            );
            return;
        }
        const done = await saveFile(
            track.url,
            getFileName({
                av: useLegacyID,
                episode: track.bilisoundEpisode ?? "",
                id: track.bilisoundId ?? "",
                title: track.title ?? "",
            }),
        );
        if (done) {
            handleClose();
        }
    }, [useLegacyID]);

    // 列表编辑
    const [isEditing, setIsEditing] = useState(false);
    // 已选中项目 index
    const [selected, setSelected] = useState({ data: new Set<number>() });
    // 列表删除
    const handleDeleteSelected = useCallback(async () => {
        const indexList = [...selected.data.values()];
        setSelected({ data: new Set() });
        await TrackPlayer.remove(indexList);
        await update();
        if ((await TrackPlayer.getQueue()).length <= 0) {
            setIsEditing(false);
        }
    }, [selected.data, update]);

    // 列表渲染
    const renderItem: ListRenderItem<Track> = info => {
        const index = info.index;
        const item = info.item;
        const isThisSong = activeTrack?.bilisoundUniqueId === item.bilisoundUniqueId;
        const trackLength = tracks.length;

        const onSelectToggle = () => {
            setSelected(({ data }) => {
                if (data.has(index)) {
                    data.delete(index);
                } else {
                    data.add(index);
                }
                return { data };
            });
        };

        const onPress = async () => {
            if (isEditing) {
                onSelectToggle();
                return;
            }
            if (isThisSong) {
                await handleTogglePlay();
                return;
            }
            await TrackPlayer.skip(index);
            await TrackPlayer.play();
        };

        const onLongPress = () => {
            currentOperateIndex.current = index;
            setDisplayTrack(item);
            setShowActionSheet(true);
        };

        return (
            <PlayListItem
                index={index}
                item={item}
                isThisSong={isThisSong}
                isEditing={isEditing}
                isSelected={selected.data.has(index)}
                trackNumberWidth={8 + `${trackLength}`.length * 8}
                onPress={onPress}
                onLongPress={onLongPress}
                onSelectToggle={onSelectToggle}
            />
        );
    };

    return (
        <CommonFrameNew
            title="正在播放"
            titleBarTheme="transparent"
            extendToBottom
            rightAccessories={
                tracks.length > 0 ? (
                    <Pressable
                        sx={COMMON_FRAME_BUTTON_STYLE}
                        onPress={() =>
                            setIsEditing(prevState => {
                                if (prevState) {
                                    setSelected({ data: new Set() });
                                }
                                return !prevState;
                            })
                        }
                    >
                        {isEditing ? (
                            <Entypo name="check" size={24} color={primaryColor} />
                        ) : (
                            <MaterialCommunityIcons name="format-list-checks" size={24} color={primaryColor} />
                        )}
                    </Pressable>
                ) : null
            }
        >
            {/* 编辑菜单 */}
            {isEditing && tracks.length > 0 ? (
                <Box
                    sx={{
                        borderWidth: 1,
                        borderColor: "$backgroundLight100",
                        _dark: {
                            borderColor: "$backgroundDark900",
                        },
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderTopWidth: 0,
                        flexDirection: "row",
                        gap: "$1",
                        padding: "$2",
                    }}
                >
                    <Box ml="$3" justifyContent="center">
                        <Checkbox
                            size="md"
                            isInvalid={false}
                            isDisabled={false}
                            aria-label="全选"
                            value=""
                            isChecked={selected.data.size >= tracks.length}
                            onChange={() => {
                                if (selected.data.size >= tracks.length) {
                                    setSelected({ data: new Set() });
                                } else {
                                    setSelected({ data: new Set([...tracks.map((e, i) => i)]) });
                                }
                            }}
                        >
                            <CheckboxIndicator mr="$2">
                                <CheckboxIcon as={CheckIcon} />
                            </CheckboxIndicator>
                            <CheckboxLabel>全选</CheckboxLabel>
                        </Checkbox>
                    </Box>
                    <Box flex={1} />
                    <Button
                        size="sm"
                        variant="solid"
                        action="negative"
                        isDisabled={selected.data.size <= 0}
                        isFocusVisible={false}
                        paddingHorizontal="$3"
                        onPress={handleDeleteSelected}
                    >
                        <ButtonText>删 除</ButtonText>
                        <ButtonIcon
                            as={MaterialIcons}
                            // @ts-ignore 属于 MaterialIcons 组件的合法参数
                            size={20}
                            name="delete"
                            ml="$1.5"
                        />
                    </Button>
                </Box>
            ) : (
                <Box
                    sx={{
                        borderWidth: 1,
                        borderColor: "$backgroundLight100",
                        _dark: {
                            borderColor: "$backgroundDark900",
                        },
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        borderTopWidth: 0,
                        height: 0,
                    }}
                />
            )}

            {/* 菜单项目 */}
            {tracks.length > 0 ? (
                <FlashList
                    data={tracks}
                    extraData={{
                        isEditing,
                        colorScheme,
                        selected,
                    }}
                    keyExtractor={item => `${item.bilisoundUniqueId}`}
                    renderItem={renderItem}
                    estimatedItemSize={(tracks.length ?? 0) * 56}
                />
            ) : (
                <Box
                    sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        flexGrow: 1,
                        gap: 16,
                    }}
                >
                    <Text
                        sx={{
                            fontSize: 14,
                            opacity: 0.5,
                        }}
                    >
                        这里空空如也
                    </Text>
                    <Button action="primary" onPress={() => router.push("/(tabs)")}>
                        <ButtonText>去查询</ButtonText>
                    </Button>
                </Box>
            )}

            {/* 操作菜单 */}
            <LongPressActions
                showActionSheet={showActionSheet}
                onClose={handleClose}
                displayTrack={displayTrack}
                onAction={action => {
                    switch (action) {
                        case "delete":
                            handleDelete();
                            break;
                        case "export":
                            handleExport();
                            break;
                        case "close":
                            handleClose();
                            break;
                        default:
                            break;
                    }
                }}
            />
        </CommonFrameNew>
    );
};

export default TabPlaying;
