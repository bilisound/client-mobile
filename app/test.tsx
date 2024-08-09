import { useState } from "react";
import { View, Text, Button } from "react-native";
import Toast from "react-native-toast-message";

export default function Page() {
    const [num, setNum] = useState(1);

    return (
        <View style={{ padding: 16, gap: 16 }}>
            <Text>Hello World!</Text>
            <Button
                title="测试 Toast"
                onPress={() => {
                    Toast.show({
                        type: ["success", "error", "info", "warning"][Math.floor(Math.random() * 4)],
                        text1: "测试消息 " + num,
                        text2: "这是一条 toast 消息",
                    });
                    setNum(Math.random());
                }}
            />
        </View>
    );
}
