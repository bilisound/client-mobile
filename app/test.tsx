import { useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

import PotatoButton from "~/components/potato-ui/PotatoButton";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogBody,
} from "~/components/ui/alert-dialog";
import { Box } from "~/components/ui/box";
import { Button, ButtonText } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Text } from "~/components/ui/text";
import { PLAYLIST_DB_VERSION, playlistStorage } from "~/storage/playlist";

export default function Page() {
    const [modalVisible, setModalVisible] = useState(false);

    function handleClose() {
        setModalVisible(false);
    }

    return (
        <View style={{ padding: 16, gap: 16 }}>
            <Text>Hello World!</Text>
            <Box className="flex flex-row items-center gap-2">
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
            </Box>
            <PotatoButton onPress={() => setModalVisible(!modalVisible)}>Modal 测试</PotatoButton>
            <PotatoButton
                color="amber"
                onPress={() => {
                    playlistStorage.set(PLAYLIST_DB_VERSION, 0);
                }}
            >
                重置 PLAYLIST_DB_VERSION 以触发迁移程序
            </PotatoButton>
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
    );
}
