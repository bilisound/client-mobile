import React, { useEffect, useRef } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, Button, Text, Pressable, ButtonText } from "@gluestack-ui/themed";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import useHistoryStore, { HistoryItem } from "../store/history";
import { COMMON_FRAME_SOLID_BUTTON_STYLE, COMMON_TOUCH_COLOR } from "../constants/style";
import CommonFrameNew from "../components/CommonFrameNew";

const History: React.FC = () => {
    const edgeInsets = useSafeAreaInsets();

    // 历史记录信息
    const { historyList, clearHistoryList, removeHistoryList, repairHistoryList } = useHistoryStore((state) => ({
        historyList: state.historyList,
        clearHistoryList: state.clearHistoryList,
        removeHistoryList: state.removeHistoryList,
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
            keyExtractor={(item) => `${item?.key}`}
            ListFooterComponent={<View style={{ height: edgeInsets.bottom }} />}
            estimatedItemSize={historyList.length}
            renderItem={(item) => {
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
                            source={data.thumbnailUrl}
                            style={{
                                height: 48,
                                aspectRatio: "3/2",
                                flex: 0,
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
        <CommonFrameNew
            title="历史记录"
            extendToBottom
            leftAccessories={
                <Pressable sx={COMMON_FRAME_SOLID_BUTTON_STYLE} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
            }
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
        </CommonFrameNew>
    );
};

export default History;
