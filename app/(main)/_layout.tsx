import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const edgeInsets = useSafeAreaInsets();

    return (
        <Tabs>
            <TabSlot />
            <TabList
                className={"absolute flex flex-col items-center justify-center"}
                style={{ left: edgeInsets.left, top: edgeInsets.top }}
            >
                <TabTrigger name="playlist" href="/(main)/playlist" className={"p-4 bg-red-500"}>
                    <Text>播放列表</Text>
                </TabTrigger>
                <TabTrigger name="index" href="/(main)" className={"p-4 bg-red-500"}>
                    <Text>主页</Text>
                </TabTrigger>
                <TabTrigger name="settings" href="/(main)/settings" className={"p-4 bg-red-500"}>
                    <Text>设置</Text>
                </TabTrigger>
            </TabList>
        </Tabs>
    );
}
