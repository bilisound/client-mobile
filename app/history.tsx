import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Alert, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import CommonLayout from "~/components/CommonLayout";
import Empty from "~/components/Empty";
import ButtonTitleBar from "~/components/potato-ui/ButtonTitleBar";
import Pressable from "~/components/potato-ui/Pressable";
import { createIcon } from "~/components/potato-ui/utils/icon";
import useHistoryStore, { HistoryItem } from "~/store/history";
import { getImageProxyUrl } from "~/utils/constant-helper";

const IconDelete = createIcon(MaterialIcons, "delete");

const History: React.FC = () => {
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

    const historyListElement = (
        <FlashList
            ref={flashListRef}
            data={historyList}
            extraData={theme}
            keyExtractor={item => `${item?.key}`}
            ListFooterComponent={<View style={{ height: edgeInsets.bottom }} />}
            estimatedItemSize={historyList.length}
            renderItem={item => {
                const data = item.item;
                // const i = item.index;
                if (!item.item) {
                    return null;
                }
                return (
                    <Pressable
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
                historyList.length > 0 ? (
                    <ButtonTitleBar
                        theme="solid"
                        Icon={IconDelete}
                        label="清除历史记录"
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
                    />
                ) : null
            }
        >
            {historyList.length > 0 ? historyListElement : <Empty onPress={() => router.push("/(tabs)")} />}
        </CommonLayout>
    );
};

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

export default History;
