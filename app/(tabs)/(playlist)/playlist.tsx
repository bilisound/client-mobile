import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    Box,
    Pressable,
    Text,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CommonLayout from "../../../components/CommonLayout";
import Empty from "../../../components/Empty";
import PlaylistItem from "../../../components/PlaylistItem";
import { COMMON_FRAME_BUTTON_STYLE, COMMON_FRAME_SOLID_BUTTON_STYLE } from "../../../constants/style";
import useCommonColors from "../../../hooks/useCommonColors";
import { PLAYLIST_ON_QUEUE, PlaylistMeta, playlistStorage, usePlaylistStorage } from "../../../storage/playlist";
import log from "../../../utils/logger";

interface PlaylistContextProps {
    onLongPress: (id: string) => void;
}

const PlaylistContext = createContext<PlaylistContextProps>({
    onLongPress: () => {},
});

function PlaylistActionItem(item: PlaylistMeta) {
    const context = useContext(PlaylistContext);

    return (
        <PlaylistItem
            item={item}
            onPress={() => {
                router.push(`/(tabs)/(playlist)/detail/${item.id}`);
            }}
            onLongPress={() => {
                context.onLongPress(item.id);
            }}
        />
    );
}

const iconWrapperStyle = {
    w: 24,
    h: 24,
    alignItems: "center",
    justifyContent: "center",
};

interface LongPressActionsProps {
    showActionSheet: boolean;
    displayTrack?: PlaylistMeta;
    onClose: () => void;
    onAction: (action: "delete" | "close" | "edit") => void;
}

/**
 * 长按操作
 */
function LongPressActions({ showActionSheet, displayTrack, onAction, onClose }: LongPressActionsProps) {
    const edgeInsets = useSafeAreaInsets();
    const { textBasicColor } = useCommonColors();

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent zIndex={999} pb={edgeInsets.bottom}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {!!displayTrack && (
                    <Box alignItems="flex-start" w="100%" px="$4" py="$4" gap="$1">
                        <Text fontWeight="700">{displayTrack.title}</Text>
                        <Text fontSize="$sm" opacity={0.6}>
                            {`${displayTrack.amount} 首歌曲`}
                        </Text>
                    </Box>
                )}
                <ActionsheetItem onPress={() => onAction("edit")}>
                    <Box sx={iconWrapperStyle}>
                        <MaterialIcons name="edit" size={24} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>重命名</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("delete")}>
                    <Box sx={iconWrapperStyle}>
                        <MaterialIcons name="delete" size={24} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>删除</ActionsheetItemText>
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

export default function Page() {
    const { primaryColor } = useCommonColors();

    const [list, setList] = usePlaylistStorage();

    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PlaylistMeta | undefined>();

    const handleClose = () => setShowActionSheet(prevState => !prevState);

    const handleLongPress = (id: string) => {
        setDisplayTrack(list.find(e => e.id === id));
        setShowActionSheet(true);
    };

    const handleDelete = () => {
        setList(prevValue => {
            log.info("用户删除歌单");
            const found = prevValue.findIndex(e => e.id === displayTrack?.id);
            if (found < 0) {
                log.error(`删除参数异常！found: ${found}, displayTrack?.id: ${displayTrack?.id}`);
                return prevValue;
            }
            return prevValue.toSpliced(found, 1);
        });

        // 清空当前播放队列隶属歌单的状态机
        const got = playlistStorage.getMap<{ value?: PlaylistMeta }>(PLAYLIST_ON_QUEUE);
        // console.log(got?.value?.id, displayTrack?.id);
        if (got?.value?.id === displayTrack?.id) {
            playlistStorage.setMap(PLAYLIST_ON_QUEUE, {});
        }
    };

    return (
        <PlaylistContext.Provider value={{ onLongPress: handleLongPress }}>
            <CommonLayout
                title="播放列表"
                titleBarTheme="transparent"
                extendToBottom
                rightAccessories={
                    <>
                        <Pressable sx={COMMON_FRAME_BUTTON_STYLE} onPress={() => router.push("/barcode")}>
                            <MaterialCommunityIcons name="qrcode-scan" size={20} color={primaryColor} />
                        </Pressable>
                        <Pressable
                            sx={COMMON_FRAME_BUTTON_STYLE}
                            onPress={() => {
                                router.push(`/(tabs)/(playlist)/meta/new`);
                            }}
                        >
                            <MaterialIcons name="add" size={24} color={primaryColor} />
                        </Pressable>
                    </>
                }
            >
                {list.length <= 0 ? (
                    <Empty
                        action="添加新列表"
                        onPress={() => {
                            router.push(`/(tabs)/(playlist)/meta/new`);
                        }}
                    />
                ) : (
                    <FlashList
                        renderItem={item => <PlaylistActionItem {...item.item} />}
                        data={list}
                        estimatedItemSize={73}
                    />
                )}
            </CommonLayout>

            {/* 操作菜单 */}
            <LongPressActions
                showActionSheet={showActionSheet}
                onClose={handleClose}
                displayTrack={displayTrack}
                onAction={action => {
                    setShowActionSheet(false);
                    switch (action) {
                        case "delete":
                            Alert.alert("删除歌单确认", `确定要删除歌单「${displayTrack?.title}」吗？`, [
                                {
                                    text: "取消",
                                    style: "cancel",
                                },
                                {
                                    text: "确定",
                                    style: "default",
                                    onPress: () => {
                                        handleDelete();
                                    },
                                },
                            ]);
                            break;
                        case "close":
                            break;
                        case "edit":
                            router.push(`./meta/${displayTrack?.id}`);
                            break;
                        default:
                            break;
                    }
                }}
            />
        </PlaylistContext.Provider>
    );
}
