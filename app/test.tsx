import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Switch } from "react-native";
import Toast from "react-native-toast-message";

import Button from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { ModalDialog } from "~/components/ui/ModalDialog";
import { ModalDialogAction } from "~/components/ui/ModalDialogAction";
import { ModalDialogDescription } from "~/components/ui/ModalDialogDescription";
import { ModalDialogTitle } from "~/components/ui/ModalDialogTitle";
import { createIcon } from "~/components/ui/utils/icon";

const LinkIcon = createIcon(Entypo, "link");

export default function Page() {
    const [disabled, setDisabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    console.log({ modalVisible });

    return (
        <View style={{ padding: 16, gap: 16 }}>
            <Text>Hello World!</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text>按钮状态 Disabled</Text>
                <Switch value={disabled} onValueChange={setDisabled} />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Button disabled={disabled} />
                <Button disabled={disabled} variant="outline" />
                <Button disabled={disabled} variant="ghost" />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Button disabled={disabled} rounded />
                <Button disabled={disabled} rounded variant="outline" />
                <Button disabled={disabled} rounded variant="ghost" />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Button disabled={disabled} color="red" rounded />
                <Button disabled={disabled} color="red" rounded variant="outline" />
                <Button disabled={disabled} color="red" rounded variant="ghost" />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
                <Button disabled={disabled} color="blue" rounded Icon={LinkIcon} />
                <Button disabled={disabled} color="blue" rounded Icon={LinkIcon} variant="outline" />
                <Button disabled={disabled} color="blue" rounded Icon={LinkIcon} variant="ghost" />
            </View>
            <Button disabled={disabled} color="blue" rounded Icon={LinkIcon} />
            <Button
                onPress={() => {
                    Toast.show({
                        type: "success",
                        text1: "测试消息".repeat(5),
                        text2: "测试消息详情".repeat(5),
                    });
                }}
            >
                Toast 测试
            </Button>
            <Button onPress={() => setModalVisible(!modalVisible)}>Modal 测试</Button>
            <Modal open={modalVisible} onOpenChange={setModalVisible}>
                <ModalDialog>
                    <ModalDialogTitle>测试对话框</ModalDialogTitle>
                    <ModalDialogDescription>
                        {`我好想做嘉然小姐的狗啊。
可是嘉然小姐说她喜欢的是猫，我哭了。
我知道既不是狗也不是猫的我为什么要哭的。因为我其实是一只老鼠。
我从没奢望嘉然小姐能喜欢自己。我明白的，所有人都喜欢理解余裕上手天才打钱的萌萌的狗狗或者猫猫，没有人会喜欢阴湿带病的老鼠。`}
                    </ModalDialogDescription>
                    <ModalDialogAction>
                        <Button variant="ghost" onPress={() => setModalVisible(false)}>
                            取消
                        </Button>
                        <Button onPress={() => setModalVisible(false)}>确定</Button>
                    </ModalDialogAction>
                </ModalDialog>
            </Modal>
        </View>
    );
}
