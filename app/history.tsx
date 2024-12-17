import useHistoryStore from "~/store/history";
import { Layout } from "~/components/layout";
import { FlashList } from "@shopify/flash-list";
import { VideoItem } from "~/components/video-item";
import { useEffect } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getImageProxyUrl } from "~/utils/constant-helper";

export default function Page() {
    // 历史记录信息
    const { historyList, clearHistoryList, repairHistoryList } = useHistoryStore(state => ({
        historyList: state.historyList,
        clearHistoryList: state.clearHistoryList,
        repairHistoryList: state.repairHistoryList,
    }));

    useEffect(() => {
        repairHistoryList();
    }, [repairHistoryList]);

    const edgeInsets = useSafeAreaInsets();

    return (
        <Layout
            title={"历史记录"}
            leftAccessories={"BACK_BUTTON"}
            edgeInsets={{
                ...edgeInsets,
                bottom: 0,
            }}
        >
            <FlashList
                contentContainerStyle={{
                    paddingBottom: edgeInsets.bottom,
                }}
                renderItem={({ item }) => {
                    return (
                        <VideoItem
                            text1={item.name}
                            text2={item.authorName}
                            image={getImageProxyUrl(item.thumbnailUrl, item.id)}
                            onPress={() => {
                                router.navigate(`/video/${item.id}`);
                            }}
                        />
                    );
                }}
                data={historyList}
                estimatedItemSize={72}
            ></FlashList>
        </Layout>
    );
}
