import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import { Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import Empty from "~/components/Empty";
import PlaylistItem from "~/components/PlaylistItem";
import ButtonTitleBar from "~/components/potato-ui/ButtonTitleBar";
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
import useCommonColors from "~/hooks/useCommonColors";
import {
    invalidateOnQueueStatus,
    PLAYLIST_ON_QUEUE,
    PlaylistMeta,
    playlistStorage,
    usePlaylistStorage,
} from "~/storage/playlist";
import log from "~/utils/logger";

interface PlaylistContextProps {
    onLongPress: (id: string) => void;
}

const IconQrcodeScan = createIcon(MaterialCommunityIcons, "qrcode-scan");
const IconAdd = createIcon(MaterialIcons, "add");

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
    const { theme } = useStyles();
    const textBasicColor = theme.colorTokens.foreground;

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent className="z-50" style={{ paddingBottom: edgeInsets.bottom }}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {!!displayTrack && (
                    <Box className="items-start w-full px-4 py-4 gap-1">
                        <Text className="font-bold">{displayTrack.title}</Text>
                        <Text className="text-sm opacity-60">{`${displayTrack.amount} 首歌曲`}</Text>
                    </Box>
                )}
                <ActionsheetItem onPress={() => onAction("edit")}>
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
                    <ActionsheetItemText>重命名</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("delete")}>
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
                <ActionsheetItem onPress={() => onAction("close")}>
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
    );
}

export default function Page() {
    const [list = [], setList] = usePlaylistStorage();

    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PlaylistMeta | undefined>();

    const handleClose = () => setShowActionSheet(prevState => !prevState);

    const handleLongPress = (id: string) => {
        setDisplayTrack(list.find(e => e.id === id));
        setShowActionSheet(true);
    };

    const handleDelete = () => {
        setList((prevValue = []) => {
            log.info("用户删除歌单");
            const found = prevValue.findIndex(e => e.id === displayTrack?.id);
            if (found < 0) {
                log.error(`删除参数异常！found: ${found}, displayTrack?.id: ${displayTrack?.id}`);
                return prevValue;
            }
            return prevValue.toSpliced(found, 1);
        });

        // 清空当前播放队列隶属歌单的状态机
        const got: { value?: PlaylistMeta } = JSON.parse(playlistStorage.getString(PLAYLIST_ON_QUEUE) || "{}");
        if (got?.value?.id === displayTrack?.id) {
            invalidateOnQueueStatus();
        }
    };

    return (
        <PlaylistContext.Provider value={{ onLongPress: handleLongPress }}>
            <CommonLayout
                title="歌单"
                titleBarTheme="transparent"
                extendToBottom
                rightAccessories={
                    <>
                        {Platform.OS === "web" ? null : (
                            <ButtonTitleBar
                                label="扫描二维码"
                                theme="transparent"
                                Icon={IconQrcodeScan}
                                iconSize={20}
                                onPress={() => router.push("/barcode")}
                            />
                        )}
                        <ButtonTitleBar
                            label="新建歌单"
                            Icon={IconAdd}
                            theme="transparent"
                            onPress={() => {
                                router.push(`/(tabs)/(playlist)/meta/new`);
                            }}
                        />
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
