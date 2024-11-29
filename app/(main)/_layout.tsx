import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { useRoute } from "@react-navigation/core";

export default function TabLayout() {
    const edgeInsets = useSafeAreaInsets();

    console.log(useRoute());

    return (
        <Tabs>
            <TabSlot />
            <TabList
                style={{
                    paddingLeft: edgeInsets.left,
                    paddingRight: edgeInsets.right,
                    paddingBottom: edgeInsets.bottom,
                    justifyContent: "space-around",
                }}
            >
                <TabTrigger
                    name="playlist"
                    href="/(main)/playlist"
                    className={"items-center justify-center flex-1 h-16"}
                >
                    <View className={"gap-1.5 w-full items-center justify-center"}>
                        <MaterialIcons name="queue-music" className={"color-typography-700/50"} size={20} />
                        <Text className={"text-xs"}>歌单</Text>
                    </View>
                </TabTrigger>
                <TabTrigger name="index" href="/(main)" className={"items-center justify-center flex-1 h-16"}>
                    <View className={"gap-1.5 w-full items-center justify-center"}>
                        <MaterialIcons name="home" className={"color-typography-700"} size={20} />
                        <Text className={"text-xs"}>主页</Text>
                    </View>
                </TabTrigger>
                <TabTrigger
                    name="settings"
                    href="/(main)/settings"
                    className={"items-center justify-center flex-1 h-16"}
                >
                    <View className={"gap-1.5 w-full items-center justify-center"}>
                        <MaterialIcons name="settings" className={"color-typography-700/50"} size={20} />
                        <Text className={"text-xs"}>设置</Text>
                    </View>
                </TabTrigger>
            </TabList>
        </Tabs>
    );
}
