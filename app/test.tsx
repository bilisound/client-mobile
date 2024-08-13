import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Switch } from "react-native";
import Toast from "react-native-toast-message";

import Button from "~/components/ui/Button";
import ModalBackdrop from "~/components/ui/ModalBackdrop";
import { createIcon } from "~/components/ui/utils/icon";

const LinkIcon = createIcon(Entypo, "link");

export default function Page() {
    const [disabled, setDisabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

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
            {/*<NativeModal
                transparent
                animationType="fade"
                visible={modalVisible}
                statusBarTranslucent
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View
                    style={{
                        backgroundColor: "#00000080",
                        width: "100%",
                        height: "100%",
                        padding: 16,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View style={{ flex: 0, padding: 16, gap: 16, backgroundColor: "white", borderRadius: 16 }}>
                        <Text>Hello World! Hello World!</Text>
                        <Button onPress={() => setModalVisible(!modalVisible)}>关闭</Button>
                    </View>
                </View>
            </NativeModal>*/}
            <Button onPress={() => setModalVisible(!modalVisible)}>Modal 测试</Button>
            <ModalBackdrop open={modalVisible} onOpenChange={setModalVisible} />
        </View>
    );
}
