import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from "expo-router/ui";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { usePathname } from "expo-router";
import { ComponentType, forwardRef, Ref } from "react";
import { twMerge } from "tailwind-merge";

type TabTriggerChildProps = TabTriggerSlotProps & {
    IconComponent: ComponentType<any>;
    iconName: string;
    title: string;
};

const TabTriggerChild = forwardRef(function TabTriggerChild(
    { isFocused, onPress, IconComponent, iconName, title, style, className, ...props }: TabTriggerChildProps,
    ref: Ref<View>,
) {
    return (
        <Pressable
            onPress={onPress}
            className={"flex-1 h-16 gap-2 w-full flex-col items-center justify-center"}
            {...props}
            ref={ref}
        >
            <IconComponent
                name={iconName}
                className={twMerge("text-[16px]", isFocused ? "color-typography-700" : "color-typography-700/40")}
                size={-1}
            />
            <Text className={twMerge("text-xs", isFocused ? "font-semibold" : "")}>{title}</Text>
        </Pressable>
    );
});

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
                <TabTrigger asChild name="playlist" href="/(main)/(playlist)/playlist">
                    <TabTriggerChild IconComponent={FontAwesome5} iconName={"list"} title={"歌单"} />
                </TabTrigger>
                <TabTrigger asChild name="index" href="/(main)">
                    <TabTriggerChild IconComponent={FontAwesome5} iconName={"search"} title={"查询"} />
                </TabTrigger>
                <TabTrigger asChild name="settings" href="/(main)/settings">
                    <TabTriggerChild IconComponent={FontAwesome6} iconName={"gear"} title={"设置"} />
                </TabTrigger>
            </TabList>
        </Tabs>
    );
}
