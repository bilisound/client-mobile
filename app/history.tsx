import useHistoryStore from "~/store/history";
import { Layout, LayoutButton } from "~/components/layout";
import { FlashList } from "@shopify/flash-list";
import { VideoItem } from "~/components/video-item";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getImageProxyUrl } from "~/utils/constant-helper";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from "~/components/ui/alert-dialog";
import { Button, ButtonText } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Heading } from "~/components/ui/heading";
import React from "react";

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

    // 确认对话框
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const handleClose = () => setShowAlertDialog(false);
    const handleOpen = () => setShowAlertDialog(true);

    const dialogContent = (
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
            <AlertDialogBackdrop />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Heading className="text-typography-950 font-semibold" size="md">
                        操作确认
                    </Heading>
                </AlertDialogHeader>
                <AlertDialogBody className="mt-3 mb-6">
                    <Text size="sm">确定要清空历史记录吗？</Text>
                </AlertDialogBody>
                <AlertDialogFooter className="">
                    <Button variant="outline" action="secondary" onPress={handleClose}>
                        <ButtonText>取消</ButtonText>
                    </Button>
                    <Button onPress={handleClose}>
                        <ButtonText>确定</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return (
        <Layout
            title={"历史记录"}
            leftAccessories={"BACK_BUTTON"}
            rightAccessories={<LayoutButton iconName={"fa6-solid:trash-can"} onPress={handleOpen} />}
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
            />
            {dialogContent}
        </Layout>
    );
}
