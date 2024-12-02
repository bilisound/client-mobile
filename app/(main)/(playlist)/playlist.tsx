import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { router } from "expo-router";
import { Pressable } from "~/components/ui/pressable";
import { useTabSafeArea } from "~/hooks/useTabSafeArea";

export default function Page() {
    const edgeInsets = useTabSafeArea(true);

    return (
        <View
            className="flex-1 bg-green-300"
            style={{
                ...edgeInsets,
            }}
        >
            <View className={"flex-1 items-center justify-center gap-4 bg-amber-200"}>
                <Text className="text-base">歌单（嵌入 stack）</Text>
                <ButtonOuter>
                    <Button onPress={() => router.push("/(main)/(playlist)/detail/1")}>
                        <ButtonText>Detail 测试</ButtonText>
                    </Button>
                </ButtonOuter>
                <ButtonOuter>
                    <Button onPress={() => router.push("/(main)/(playlist)/meta/1")}>
                        <ButtonText>Meta 测试</ButtonText>
                    </Button>
                </ButtonOuter>
                <Pressable className={"p-4 border {}-[android_ripple.color]/color:color-amber-400"}>
                    <Text>Pressable 测试</Text>
                </Pressable>
            </View>
        </View>
    );
}
