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
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Heading } from "~/components/ui/heading";
import React from "react";
import { Toast, ToastDescription, ToastIcon, ToastTitle, useToast } from "~/components/ui/toast";
import { View } from "react-native";

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

    const toast = useToast();
    const [toastId, setToastId] = useState(0);

    const handleToast = () => {
        clearHistoryList();
        if (!toast.isActive(toastId + "")) {
            showNewToast();
        }
    };

    const showNewToast = () => {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
            id: newId + "",
            placement: "top",
            duration: 5000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                    <Toast nativeID={uniqueToastId} variant={"outline2"} action={"success"}>
                        <ToastIcon />
                        <View className={"gap-1 flex-0"}>
                            <ToastTitle>操作成功</ToastTitle>
                            <ToastDescription>历史记录已经清除</ToastDescription>
                        </View>
                    </Toast>
                );
            },
        });
    };

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
                    <ButtonOuter>
                        <Button variant="ghost" action="secondary" onPress={handleClose}>
                            <ButtonText>取消</ButtonText>
                        </Button>
                    </ButtonOuter>
                    <ButtonOuter>
                        <Button
                            onPress={() => {
                                handleToast();
                                handleClose();
                            }}
                        >
                            <ButtonText>确定</ButtonText>
                        </Button>
                    </ButtonOuter>
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
