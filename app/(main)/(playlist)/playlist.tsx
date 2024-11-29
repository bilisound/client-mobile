import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { router } from "expo-router";

export default function Page() {
    return (
        <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-base">歌单（嵌入 stack）</Text>
            <ButtonOuter>
                <Button
                    onPress={() => router.push("/(main)/(playlist)/detail/1")}
                    android_ripple={{
                        color: "#808080",
                    }}
                >
                    <ButtonText>Detail 测试</ButtonText>
                </Button>
            </ButtonOuter>
            <Button onPress={() => router.push("/(main)/(playlist)/meta/1")}>
                <ButtonText>Meta 测试</ButtonText>
            </Button>
        </View>
    );
}
