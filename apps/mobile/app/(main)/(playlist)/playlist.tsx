import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePlaylistMeta, getPlaylistMetas } from "~/storage/sqlite/playlist";
import { Layout, LayoutButton } from "~/components/layout";
import React, { createContext, useContext, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { PlaylistItem } from "~/components/playlist-item";
import { Menu, MenuItem, MenuItemLabel } from "~/components/ui/menu";
import { Monicon } from "@monicon/native";
import { Box } from "~/components/ui/box";
import { useTabSafeAreaInsets } from "~/hooks/useTabSafeAreaInsets";
import { exportPlaylistToFile, importPlaylistFromFile } from "~/utils/exchange/playlist";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
} from "~/components/ui/actionsheet";
import { Text } from "~/components/ui/text";
import { PlaylistMeta } from "~/storage/sqlite/schema";
import { useWindowDimensions, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useConfirm } from "~/hooks/useConfirm";
import log from "~/utils/logger";
import { invalidateOnQueueStatus, PLAYLIST_ON_QUEUE, playlistStorage } from "~/storage/playlist";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Heading } from "~/components/ui/heading";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { useUpdateTriggerStore } from "~/store/update-trigger";

interface PlaylistContextProps {
    onLongPress: (id: number) => void;
    width: number;
    columns: number;
}

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
                router.push(`/(main)/(playlist)/detail/${item.id}`);
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

    return (
        <Actionsheet isOpen={showActionSheet} onClose={onClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent className="z-50">
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {!!displayTrack && (
                    <View className="items-start w-full px-4 py-4 gap-1">
                        <Text className="font-bold">{displayTrack.title}</Text>
                        <Text className="text-sm opacity-60">{`${displayTrack.amount} 首歌曲`}</Text>
                    </View>
                )}
                <ActionsheetItem onPress={() => onAction("edit")}>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MaterialIcons name="edit" size={24} className="color-typography-700" />
                    </View>
                    <ActionsheetItemText>修改信息</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("delete")}>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MaterialIcons name="delete" size={24} className="color-typography-700" />
                    </View>
                    <ActionsheetItemText>删除</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem
                    onPress={() => {
                        onAction("export");
                    }}
                >
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons name="save" size={20} className="color-typography-700" />
                    </View>
                    <ActionsheetItemText>导出</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={() => onAction("close")}>
                    <View
                        style={{
                            width: 24,
                            height: 24,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MaterialIcons name="cancel" size={22} className="color-typography-700" />
                    </View>
                    <ActionsheetItemText>取消</ActionsheetItemText>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    );
}

export default function Page() {
    const edgeInsets = useTabSafeAreaInsets();
    const queryClient = useQueryClient();
    const { data, refetch } = useQuery({
        queryKey: ["playlist_meta"],
        queryFn: () => getPlaylistMetas(),
    });

    const handleImport = async () => {
        const result = await importPlaylistFromFile();
        if (result) {
            await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });
            await queryClient.invalidateQueries({ queryKey: ["playlist_meta_apply"] });
            await refetch();
        }
    };

    // 布局管理
    const windowDimensions = useWindowDimensions();
    const columns = windowDimensions.width > 1024 ? 2 : 1;
    const [width, setWidth] = useState(0);

    // 模态框管理
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PlaylistMeta | undefined>();
    const { dialogInfo, setDialogInfo, modalVisible, setModalVisible, handleClose, dialogCallback } = useConfirm();

    const handleActionSheetClose = () => setShowActionSheet(prevState => !prevState);

    const handleLongPress = (id: number) => {
        setDisplayTrack(data?.find(e => e.id === id));
        setShowActionSheet(true);
    };

    const handleDelete = async () => {
        dialogCallback.current = async () => {
            log.info("用户删除歌单");
            await deletePlaylistMeta(displayTrack!.id);
            await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });
            await queryClient.invalidateQueries({ queryKey: ["playlist_meta_apply"] });
            useUpdateTriggerStore.getState().incrementCount();

            // 清空当前播放队列隶属歌单的状态机
            const got: { value?: PlaylistMeta } = JSON.parse(playlistStorage.getString(PLAYLIST_ON_QUEUE) || "{}");
            if (got?.value?.id === displayTrack?.id) {
                invalidateOnQueueStatus();
            }

            Toast.show({
                type: "success",
                text1: "歌单删除成功",
                text2: displayTrack?.title,
            });
        };
        setDialogInfo(e => ({
            ...e,
            title: "删除歌单确认",
            description: `确定要删除歌单「${displayTrack?.title}」吗？`,
        }));
        setModalVisible(true);
    };

    return (
        <PlaylistContext.Provider value={{ onLongPress: handleLongPress, width, columns }}>
            <Layout
                edgeInsets={{ ...edgeInsets, bottom: 0 }}
                title={"歌单"}
                rightAccessories={
                    <>
                        <LayoutButton
                            iconName={"uil:qrcode-scan"}
                            aria-label={"扫描二维码"}
                            iconSize={22}
                            onPress={() => {
                                router.navigate("/barcode");
                            }}
                        />
                        <Menu
                            placement="bottom right"
                            offset={5}
                            disabledKeys={["Settings"]}
                            trigger={({ ...triggerProps }) => {
                                return (
                                    <LayoutButton
                                        iconName={"fa6-solid:plus"}
                                        aria-label={"添加或导入歌单"}
                                        {...triggerProps}
                                    />
                                );
                            }}
                        >
                            <MenuItem
                                key="create"
                                textValue="创建新歌单"
                                onPress={() => {
                                    router.navigate("/(main)/(playlist)/meta/new");
                                }}
                            >
                                <Box className={"size-4 items-center justify-center mr-3"}>
                                    <Monicon name={"fa6-solid:plus"} size={16} className={"text-typography-700"} />
                                </Box>
                                <MenuItemLabel>创建新歌单</MenuItemLabel>
                            </MenuItem>
                            <MenuItem key="import" textValue="导入歌单" onPress={handleImport}>
                                <Box className={"size-4 items-center justify-center mr-3"}>
                                    <Monicon
                                        name={"fa6-solid:file-import"}
                                        size={16}
                                        className={"text-typography-700"}
                                    />
                                </Box>
                                <MenuItemLabel>导入歌单</MenuItemLabel>
                            </MenuItem>
                        </Menu>
                    </>
                }
            >
                {/* 不能用 ListEmptyComponent 做空内容提示的原因：https://github.com/Shopify/flash-list/issues/848 */}
                {(data || []).length > 0 ? (
                    <FlashList
                        data={data}
                        renderItem={e => <PlaylistActionItem {...e.item} />}
                        estimatedItemSize={80}
                        numColumns={columns}
                        onLayout={e => {
                            setWidth(e.nativeEvent.layout.width);
                        }}
                        contentContainerStyle={{
                            paddingBottom: edgeInsets.bottom,
                        }}
                    />
                ) : (
                    <View className={"flex-1 items-center justify-center gap-4"}>
                        <Text className={"leading-normal text-sm font-semibold color-typography-500"}>
                            这里空空如也
                        </Text>
                        <ButtonOuter>
                            <Button onPress={() => router.navigate("/")}>
                                <ButtonText>去查询</ButtonText>
                            </Button>
                        </ButtonOuter>
                    </View>
                )}

                {/* 操作菜单 */}
                <LongPressActions
                    showActionSheet={showActionSheet}
                    onClose={handleActionSheetClose}
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

                {/* 对话框 */}
                <AlertDialog isOpen={modalVisible} onClose={() => handleClose(false)} size="md">
                    <AlertDialogBackdrop />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <Heading className="text-typography-950 font-semibold" size="md">
                                {dialogInfo.title}
                            </Heading>
                        </AlertDialogHeader>
                        <AlertDialogBody className="mt-4 mb-6">
                            <Text size="sm" className="leading-normal">
                                {dialogInfo.description}
                            </Text>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <ButtonOuter>
                                <Button variant="ghost" onPress={() => handleClose(false)}>
                                    <ButtonText>{dialogInfo.cancel}</ButtonText>
                                </Button>
                            </ButtonOuter>
                            <ButtonOuter>
                                <Button onPress={() => handleClose(true)}>
                                    <ButtonText>{dialogInfo.ok}</ButtonText>
                                </Button>
                            </ButtonOuter>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Layout>
        </PlaylistContext.Provider>
    );
}
