import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Box, Button, Text, Pressable, ButtonText } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CommonLayout from "~/components/CommonLayout";
import { COMMON_FRAME_SOLID_BUTTON_STYLE, COMMON_TOUCH_COLOR } from "~/constants/style";
import useHistoryStore, { HistoryItem } from "~/store/history";
import { getImageProxyUrl } from "~/utils/constant-helper";

const History: React.FC = () => {
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

    const historyListElement = (
        <FlashList
            ref={flashListRef}
            data={historyList}
            keyExtractor={item => `${item?.key}`}
            ListFooterComponent={<View style={{ height: edgeInsets.bottom }} />}
            estimatedItemSize={historyList.length}
            renderItem={item => {
                const data = item.item;
                const i = item.index;
                if (!item.item) {
                    return null;
                }
                return (
                    <Pressable
                        onPress={() => {
                            router.push(`/query/${data.id}?noHistory=1`);
                        }}
                        onLongPress={() => null}
                        sx={{
                            ...COMMON_TOUCH_COLOR,
                            flexDirection: "row",
                            alignItems: "center",
                            height: 72,
                            paddingHorizontal: 16,
                            gap: 16,
                        }}
                    >
                        <Image
                            source={getImageProxyUrl(data.thumbnailUrl, data.id)}
                            style={{
                                height: 48,
                                aspectRatio: "3/2",
                                flex: 0,
                                flexBasis: "auto",
                                borderRadius: 8,
                            }}
                        />
                        <Box
                            sx={{
                                flex: 1,
                                gap: "$1",
                            }}
                        >
                            <Text
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: 14,
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={1}
                            >
                                {data.name}
                            </Text>
                            <Text
                                sx={{
                                    opacity: 0.5,
                                    fontSize: 12,
                                }}
                                ellipsizeMode="tail"
                                numberOfLines={1}
                            >
                                {data.authorName}
                            </Text>
                        </Box>
                    </Pressable>
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
                <Pressable
                    sx={COMMON_FRAME_SOLID_BUTTON_STYLE}
                    onPress={() => {
                        Alert.alert("清除历史记录", "确定要清除历史记录吗？", [
                            {
                                text: "取消",
                                style: "cancel",
                            },
                            {
                                text: "确定",
                                style: "default",
                                onPress: () => {
                                    clearHistoryList();
                                },
                            },
                        ]);
                    }}
                >
                    <MaterialIcons name="delete" size={24} color="#fff" />
                </Pressable>
            }
        >
            {historyList.length > 0 ? (
                historyListElement
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
                    <Button onPress={() => router.push("/(tabs)")}>
                        <ButtonText>去查询</ButtonText>
                    </Button>
                </Box>
            )}
        </CommonLayout>
    );
};

export default History;
