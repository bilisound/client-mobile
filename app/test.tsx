import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, useColorScheme, View } from "react-native";
import Toast from "react-native-toast-message";

import CommonLayout from "~/components/CommonLayout";
import PotatoButton from "~/components/potato-ui/PotatoButton";
import PotatoToast from "~/components/potato-ui/PotatoToast";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from "~/components/ui/alert-dialog";
import { Button, ButtonText } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Text } from "~/components/ui/text";
import { invalidateOnQueueStatus, PLAYLIST_DB_VERSION, playlistStorage } from "~/storage/playlist";
import { deleteAllPlaylist } from "~/storage/sqlite/playlist";

export default function Page() {
    const [modalVisible, setModalVisible] = useState(false);
    const queryClient = useQueryClient();

    const colorScheme = useColorScheme();

    function handleClose() {
        setModalVisible(false);
    }

    return (
        <CommonLayout title="测试页面" leftAccessories="backButton">
            <ScrollView className="@container">
                <View className="p-4 gap-4">
                    <Text>Hello World!</Text>
                    <View className="flex flex-row items-center gap-2">
                        <PotatoButton
                            onPress={() => {
                                Toast.show({
                                    type: "success",
                                    text1: "测试消息".repeat(5),
                                    text2: "测试消息详情".repeat(5),
                                });
                            }}
                        >
                            Toast 测试
                        </PotatoButton>
                        <Button>
                            <ButtonText className="text-sm">Toast 测试</ButtonText>
                        </Button>
                    </View>
                    <View className="gap-2 flex-row">
                        <PotatoButton onPress={() => setModalVisible(!modalVisible)}>测试</PotatoButton>
                        <PotatoButton rounded>测试</PotatoButton>
                        <PotatoButton variant="outline">测试</PotatoButton>
                        <PotatoButton variant="ghost">测试</PotatoButton>
                    </View>
                    <PotatoButton
                        color="warning"
                        onPress={() => {
                            playlistStorage.set(PLAYLIST_DB_VERSION, 0);
                        }}
                    >
                        重置 PLAYLIST_DB_VERSION 以触发迁移程序
                    </PotatoButton>
                    <PotatoButton
                        color="error"
                        onPress={async () => {
                            await deleteAllPlaylist();
                            invalidateOnQueueStatus();
                            await queryClient.invalidateQueries();
                        }}
                    >
                        删除全部歌单并解绑当前播放队列
                    </PotatoButton>
                    <Text className="sm:bg-green-500">test sm</Text>
                    <Text className="md:bg-blue-500">test md</Text>
                    <Text className="lg:bg-red-500">test lg</Text>
                    <Text className="xl:bg-orange-500">test xl</Text>
                    <Text className="2xl:bg-amber-500">test 2xl</Text>
                    <Text>{`useColorScheme() returns: ${colorScheme}`}</Text>
                    <PotatoToast type="success" title="操作成功" description="数据已成功保存！" />
                    <PotatoToast type="info" title="系统提示" description="请注意，新版本已发布。" />
                    <PotatoToast type="warning" title="友情提醒" description="您的账户余额不足，请及时充值。" />
                    <PotatoToast type="error" title="错误提示" description="发生未知错误，请稍后重试。" />
                    <AlertDialog isOpen={modalVisible} onClose={handleClose} size="md">
                        <AlertDialogBackdrop />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <Heading className="text-typography-950 font-semibold" size="lg">
                                    测试对话框
                                </Heading>
                            </AlertDialogHeader>
                            <AlertDialogBody className="mt-4 mb-6">
                                <Text size="sm" className="leading-normal">
                                    {`我好想做嘉然小姐的狗啊。
可是嘉然小姐说她喜欢的是猫，我哭了。
我知道既不是狗也不是猫的我为什么要哭的。因为我其实是一只老鼠。
我从没奢望嘉然小姐能喜欢自己。我明白的，所有人都喜欢理解余裕上手天才打钱的萌萌的狗狗或者猫猫，没有人会喜欢阴湿带病的老鼠。`}
                                </Text>
                            </AlertDialogBody>
                            <AlertDialogFooter className="gap-2">
                                <PotatoButton variant="ghost" onPress={handleClose}>
                                    取消
                                </PotatoButton>
                                <PotatoButton onPress={handleClose}>确定</PotatoButton>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </View>
            </ScrollView>
        </CommonLayout>
    );
}
