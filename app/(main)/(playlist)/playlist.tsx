import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { router } from "expo-router";
import { Pressable } from "~/components/ui/pressable";
import { TabSafeAreaView } from "~/hooks/useTabSafeAreaInsets";

export default function Page() {
    return (
        <TabSafeAreaView className="flex-1">
            <View className={"flex-1 items-center justify-center gap-4"}>
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
                <Pressable
                    className={"p-4 border border-typography-700 {}-[android_ripple.color]/color:color-amber-400"}
                >
                    <Text>Pressable 测试</Text>
                </Pressable>
            </View>
        </TabSafeAreaView>
    );
}
