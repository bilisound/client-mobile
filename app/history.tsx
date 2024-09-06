import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import Empty from "~/components/Empty";
import PotatoButton from "~/components/potato-ui/PotatoButton";
import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { createIcon } from "~/components/potato-ui/utils/icon";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Box } from "~/components/ui/box";
import { Heading } from "~/components/ui/heading";
import { Text } from "~/components/ui/text";
import useHistoryStore, { HistoryItem } from "~/store/history";
import { getImageProxyUrl } from "~/utils/constant-helper";

const IconDelete = createIcon(MaterialIcons, "delete");

export default function Page() {
    const edgeInsets = useSafeAreaInsets();
    const { styles, theme } = useStyles(styleSheet);

    // 历史记录信息
    const { historyList, clearHistoryList, repairHistoryList } = useHistoryStore(state => ({
        historyList: state.historyList,
        clearHistoryList: state.clearHistoryList,
        repairHistoryList: state.repairHistoryList,
    }));

    useEffect(() => {
        repairHistoryList();
    }, [repairHistoryList]);

    const flashListRef = useRef<FlashList<HistoryItem>>(null);

    const [modalVisible, setModalVisible] = useState(false);

    function handleClose(ok = false) {
        setModalVisible(false);
        if (ok) {
            clearHistoryList();
        }
    }

    const historyListElement = (
        <FlashList
            ref={flashListRef}
            data={historyList}
            extraData={theme}
            keyExtractor={item => `${item?.key}`}
            ListHeaderComponent={<Box className="h-3" />}
            ListFooterComponent={<View style={{ height: edgeInsets.bottom + 12 }} />}
            estimatedItemSize={historyList.length}
            renderItem={item => {
                const data = item.item;
                // const i = item.index;
                if (!item.item) {
                    return null;
                }
                return (
                    <PotatoPressable
                        onPress={() => {
                            router.push(`/query/${data.id}?noHistory=1`);
                        }}
                        onLongPress={() => null}
                        style={[styles.historyItem]}
                    >
                        <Image source={getImageProxyUrl(data.thumbnailUrl, data.id)} style={styles.thumbnail} />
                        <View style={styles.textContainer}>
                            <Text style={styles.titleText} ellipsizeMode="tail" numberOfLines={1}>
                                {data.name}
                            </Text>
                            <Text style={styles.authorText} ellipsizeMode="tail" numberOfLines={1}>
                                {data.authorName}
                            </Text>
                        </View>
                    </PotatoPressable>
                );
            }}
        />
    );

    return (
        <CommonLayout
            title="历史记录"
            extendToBottom
            leftAccessories="backButton"
            rightAccessories={
                historyList.length > 0 ? (
                    <PotatoButtonTitleBar
                        theme="solid"
                        Icon={IconDelete}
                        label="清除历史记录"
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    />
                ) : null
            }
        >
            {historyList.length > 0 ? historyListElement : <Empty onPress={() => router.push("/(tabs)")} />}
            <AlertDialog isOpen={modalVisible} onClose={() => handleClose(false)} size="md">
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-typography-950 font-semibold" size="lg">
                            清除历史记录
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className="mt-4 mb-6">
                        <Text size="sm" className="leading-normal">
                            确定要清除历史记录吗？
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter className="gap-2">
                        <PotatoButton variant="ghost" onPress={() => handleClose(false)}>
                            取消
                        </PotatoButton>
                        <PotatoButton onPress={() => handleClose(true)}>确定</PotatoButton>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CommonLayout>
    );
}

const styleSheet = createStyleSheet(theme => ({
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        height: 72,
        paddingHorizontal: 16,
        gap: 16,
    },
    thumbnail: {
        height: 48,
        aspectRatio: 3 / 2,
        flex: 0,
        flexBasis: "auto",
        borderRadius: 8,
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    titleText: {
        fontWeight: "bold",
        fontSize: 14,
        color: theme.colorTokens.foreground,
    },
    authorText: {
        opacity: 0.5,
        fontSize: 12,
        color: theme.colorTokens.foreground,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        gap: 16,
    },
    emptyText: {
        fontSize: 14,
        opacity: 0.5,
    },
}));
