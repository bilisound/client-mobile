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
                        type: ["success", "error", "info"][Math.floor(Math.random() * 3)],
                        text1: "Hello " + num,
                        text2: "This is some something 👋",
                    });
                    setNum(Math.random());
                }}
            />
        </View>
    );
}
