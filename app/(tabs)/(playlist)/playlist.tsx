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
    Button,
    ButtonText,
    Heading,
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pressable,
    Text,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { createContext, useContext, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CommonLayout from "../../../components/CommonLayout";
import Empty from "../../../components/Empty";
import PlaylistItem from "../../../components/PlaylistItem";
import { COMMON_FRAME_SOLID_BUTTON_STYLE } from "../../../constants/style";
import useCommonColors from "../../../hooks/useCommonColors";
import { PlaylistMeta, usePlaylistStorage } from "../../../storage/playlist";
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

interface DeleteConfirmDialogProps {
    showModal: boolean;
    onClose: (confirmed: boolean) => void;
    displayTrack?: PlaylistMeta;
}

/**
 * 删除对话框
 */
function DeleteConfirmDialog({ showModal, onClose, displayTrack }: DeleteConfirmDialogProps) {
    const ref = useRef(null);
    return (
        <Modal
            isOpen={showModal}
            onClose={() => {
                onClose(false);
            }}
            finalFocusRef={ref}
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">删除播放列表</Heading>
                </ModalHeader>
                <ModalBody>
                    <Text>{`确定要删除播放列表「${displayTrack?.title}」吗？`}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        action="secondary"
                        mr="$3"
                        onPress={() => {
                            onClose(false);
                        }}
                    >
                        <ButtonText>取消</ButtonText>
                    </Button>
                    <Button
                        size="sm"
                        action="negative"
                        borderWidth="$0"
                        onPress={() => {
                            onClose(true);
                        }}
                    >
                        <ButtonText>确定</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
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
                        <MaterialCommunityIcons name="view-list" size={24} color={textBasicColor} />
                    </Box>
                    <ActionsheetItemText>查看</ActionsheetItemText>
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
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const [displayTrack, setDisplayTrack] = useState<PlaylistMeta | undefined>();

    const handleClose = () => setShowActionSheet(prevState => !prevState);

    const handleLongPress = (id: string) => {
        setDisplayTrack(list.find(e => e.id === id));
        setShowActionSheet(true);
    };

    const handleDelete = (ok: boolean) => {
        setShowDeleteConfirmDialog(false);
        if (!ok) {
            return;
        }
        setList(prevValue => {
            log.info("用户删除歌单");
            const found = prevValue.findIndex(e => e.id === displayTrack?.id);
            if (found < 0) {
                log.error(`删除参数异常！found: ${found}, displayTrack?.id: ${displayTrack?.id}`);
                return prevValue;
            }
            return prevValue.toSpliced(found, 1);
        });
    };

    return (
        <PlaylistContext.Provider value={{ onLongPress: handleLongPress }}>
            <CommonLayout
                title="播放列表"
                titleBarTheme="transparent"
                extendToBottom
                rightAccessories={
                    <Pressable
                        sx={COMMON_FRAME_SOLID_BUTTON_STYLE}
                        onPress={() => {
                            router.push(`/(tabs)/(playlist)/meta/new`);
                        }}
                    >
                        <MaterialIcons name="add" size={24} color={primaryColor} />
                    </Pressable>
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
                            setShowDeleteConfirmDialog(true);
                            break;
                        case "close":
                            break;
                        case "edit":
                            break;
                        default:
                            break;
                    }
                }}
            />

            {/* 确认删除对话框 */}
            <DeleteConfirmDialog
                showModal={showDeleteConfirmDialog}
                onClose={handleDelete}
                displayTrack={displayTrack}
            />
        </PlaylistContext.Provider>
    );
}
