import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
            keyExtractor={item => `${item?.key}`}
            ListHeaderComponent={<Box className="h-1" />}
            ListFooterComponent={<View style={{ height: edgeInsets.bottom + 4 }} />}
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
                        className="flex-row items-center py-3 px-4 gap-4"
                    >
                        <Image
                            source={getImageProxyUrl(data.thumbnailUrl, data.id)}
                            className="h-12 aspect-[3/2] flex-0 basis-auto rounded-lg"
                        />
                        <View className="flex-1 gap-1">
                            <Text
                                className="font-semibold text-sm leading-normal"
                                ellipsizeMode="tail"
                                numberOfLines={1}
                            >
                                {data.name}
                            </Text>
                            <Text className="text-xs opacity-50 leading-normal" ellipsizeMode="tail" numberOfLines={1}>
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
            overrideEdgeInsets={{
                bottom: 0,
            }}
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
