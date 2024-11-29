import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { View } from "react-native";
import { usePathname } from "expo-router";

export default function TabLayout() {
    const edgeInsets = useSafeAreaInsets();
    const pathname = usePathname();
    console.log(pathname);

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
                className={"bg-background-50"}
            >
                <TabTrigger
                    name="playlist"
                    href="/(main)/(playlist)/playlist"
                    className={"items-center justify-center flex-1 h-16"}
                >
                    <View className={"gap-2 w-full items-center justify-center"}>
                        <FontAwesome5 name="list" className={"color-typography-700/50 text-[16px]"} size={-1} />
                        <Text className={"text-xs"}>歌单</Text>
                    </View>
                </TabTrigger>
                <TabTrigger name="index" href="/(main)" className={"items-center justify-center flex-1 h-16"}>
                    <View className={"gap-2 w-full items-center justify-center"}>
                        <FontAwesome5 name="search" className={"color-typography-700 text-[16px]"} size={-1} />
                        <Text className={"text-xs font-semibold"}>查询</Text>
                    </View>
                </TabTrigger>
                <TabTrigger
                    name="settings"
                    href="/(main)/settings"
                    className={"items-center justify-center flex-1 h-16"}
                >
                    <View className={"gap-2 w-full items-center justify-center"}>
                        <FontAwesome6 name="gear" className={"color-typography-700/50 text-[16px]"} size={-1} />
                        <Text className={"text-xs"}>设置</Text>
                    </View>
                </TabTrigger>
            </TabList>
        </Tabs>
    );
}
