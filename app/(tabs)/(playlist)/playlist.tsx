import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { FolderOpen, ListPlus } from "lucide-react-native";
import React, { createContext, useContext, useState } from "react";
import { Alert, Platform, ScaledSize, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import Empty from "~/components/Empty";
import PlaylistItem from "~/components/PlaylistItem";
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
import { Icon } from "~/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "~/components/ui/menu";
import { Text } from "~/components/ui/text";
import { useTabPaddingBottom } from "~/hooks/useTabPaddingBottom";
import { invalidateOnQueueStatus, PLAYLIST_ON_QUEUE, playlistStorage } from "~/storage/playlist";
import { deletePlaylistMeta, getPlaylistMetas } from "~/storage/sqlite/playlist";
import { PlaylistMeta } from "~/storage/sqlite/schema";
import { exportPlaylistToFile, importPlaylistFromFile } from "~/utils/exchange/playlist";
import log from "~/utils/logger";

interface PlaylistContextProps {
    onLongPress: (id: number) => void;
    width: number;
    columns: number;
}

const IconQrcodeScan = createIcon(MaterialCommunityIcons, "qrcode-scan");
const IconAdd = createIcon(MaterialIcons, "add");

const PlaylistContext = createContext<PlaylistContextProps>({
    columns: 0,
    onLongPress: () => {},
    width: 0,
});

function PlaylistActionItem(item: PlaylistMeta) {
    const { onLongPress, columns, width } = useContext(PlaylistContext);

    return (
        <PlaylistItem
            item={item}
            onPress={() => {
                router.push(`/(tabs)/(playlist)/detail/${item.id}`);
            }}
            onLongPress={() => {
                onLongPress(item.id);
            }}
            style={{ width: columns === 2 ? width / 2 : undefined }}
        />
    );
}

interface LongPressActionsProps {
    showActionSheet: boolean;
    displayTrack?: PlaylistMeta;
    onClose: () => void;
    onAction: (action: "delete" | "close" | "edit" | "export") => void;
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
                    <ActionsheetItemText>修改信息</ActionsheetItemText>
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
                <ActionsheetItem
                    onPress={() => {
                        onAction("export");
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
    const bottom = useTabPaddingBottom();
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ["playlist_meta"],
        queryFn: () => getPlaylistMetas(),
    });

    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PlaylistMeta | undefined>();

    const windowDimensions = useWindowDimensions();
    const columns = windowDimensions.width > 768 ? 2 : 1;
    const [width, setWidth] = useState(0);

    const handleClose = () => setShowActionSheet(prevState => !prevState);

    const handleLongPress = (id: number) => {
        setDisplayTrack(data?.find(e => e.id === id));
        setShowActionSheet(true);
    };

    const handleDelete = async () => {
        Alert.alert("删除歌单确认", `确定要删除歌单「${displayTrack?.title}」吗？`, [
            {
                text: "取消",
                style: "cancel",
            },
            {
                text: "确定",
                style: "default",
                onPress: async () => {
                    log.info("用户删除歌单");
                    await deletePlaylistMeta(displayTrack!.id);
                    await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });

                    // 清空当前播放队列隶属歌单的状态机
                    const got: { value?: PlaylistMeta } = JSON.parse(
                        playlistStorage.getString(PLAYLIST_ON_QUEUE) || "{}",
                    );
                    if (got?.value?.id === displayTrack?.id) {
                        invalidateOnQueueStatus();
                    }
                },
            },
        ]);
    };

    const handleImport = async () => {
        const result = await importPlaylistFromFile();
        if (result) {
            await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });
        }
    };

    return (
        <PlaylistContext.Provider value={{ onLongPress: handleLongPress, width, columns }}>
            <CommonLayout
                title="歌单"
                titleBarTheme="transparent"
                overrideEdgeInsets={{
                    bottom: 0,
                }}
                rightAccessories={
                    <>
                        {Platform.OS === "web" ? null : (
                            <PotatoButtonTitleBar
                                label="扫描二维码"
                                theme="transparent"
                                Icon={IconQrcodeScan}
                                iconSize={20}
                                onPress={() => router.push("/barcode")}
                            />
                        )}
                        <Menu
                            placement="bottom right"
                            offset={5}
                            disabledKeys={["Settings"]}
                            trigger={({ ...triggerProps }) => {
                                return (
                                    <PotatoButtonTitleBar
                                        label="新建歌单"
                                        Icon={IconAdd}
                                        theme="transparent"
                                        {...triggerProps}
                                    />
                                );
                            }}
                        >
                            <MenuItem textValue="新建歌单" onPress={() => router.push(`/(tabs)/(playlist)/meta/new`)}>
                                <Icon as={ListPlus} size="lg" className="mr-3 text-typography-500" />
                                <MenuItemLabel size="md">新建歌单</MenuItemLabel>
                            </MenuItem>
                            <MenuItem textValue="导入歌单" onPress={() => handleImport()}>
                                <Icon as={FolderOpen} size="lg" className="mr-3 text-typography-500" />
                                <MenuItemLabel size="md">导入歌单</MenuItemLabel>
                            </MenuItem>
                        </Menu>
                    </>
                }
            >
                {(data ?? []).length <= 0 ? (
                    <Empty
                        action="添加新列表"
                        onPress={() => {
                            router.push(`/(tabs)/(playlist)/meta/new`);
                        }}
                        style={{
                            paddingBottom: bottom,
                        }}
                    />
                ) : (
                    <FlashList
                        renderItem={item => <PlaylistActionItem {...item.item} />}
                        data={data}
                        estimatedItemSize={73}
                        ListFooterComponent={<Box style={{ height: bottom }} aria-hidden />}
                        numColumns={columns}
                        extraData={columns}
                        onLayout={e => {
                            setWidth(e.nativeEvent.layout.width);
                        }}
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
                            handleDelete();
                            break;
                        case "close":
                            break;
                        case "edit":
                            router.push(`./meta/${displayTrack?.id}`);
                            break;
                        case "export":
                            if (displayTrack?.id) {
                                exportPlaylistToFile(displayTrack.id);
                            }
                            break;
                        default:
                            break;
                    }
                }}
            />
        </PlaylistContext.Provider>
    );
}
