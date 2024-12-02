import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from "expo-router/ui";
import { Text } from "~/components/ui/text";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
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
            className={"max-md:flex-1 md:basis-auto h-16 gap-2 w-full md:w-16 flex-col items-center justify-center"}
            {...props}
            ref={ref}
        >
            <IconComponent
                name={iconName}
                className={twMerge("text-[16px]", isFocused ? "color-accent-500" : "color-typography-700/40")}
                size={-1}
            />
            <Text className={twMerge("text-xs", isFocused ? "color-accent-500 font-semibold" : "")}>{title}</Text>
        </Pressable>
    );
});

export default function TabLayout() {
    return (
        <Tabs className={"md:flex-row-reverse"}>
            <TabSlot />
            <TabList
                className={
                    "px-safe pb-safe !flex-row !justify-around bg-background-50 md:!flex-col md:pr-0 md:pt-safe md:!justify-start"
                }
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
