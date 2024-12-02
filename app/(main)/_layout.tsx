import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps } from "expo-router/ui";
import { Text } from "~/components/ui/text";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { Pressable, useWindowDimensions, View } from "react-native";
import { ComponentType, forwardRef, Ref } from "react";
import { twMerge } from "tailwind-merge";
import { TabSafeAreaContext } from "~/hooks/useTabSafeArea";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { breakpoints } from "~/constants/styles";
import { simpleCopy } from "~/utils/misc";

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
            className={
                "max-md:flex-1 md:basis-auto h-16 gap-2 w-full flex-col items-center justify-center " +
                "md:w-16 " +
                "xl:flex-row xl:gap-3 xl:h-12 xl:justify-start xl:px-5 xl:w-56 xl:rounded-full " +
                (isFocused ? "xl:bg-background-0" : "")
            }
            {...props}
            ref={ref}
        >
            <IconComponent
                name={iconName}
                className={twMerge("text-[16px]", isFocused ? "color-accent-500" : "color-typography-700/40")}
                size={-1}
            />
            <Text className={twMerge("text-xs xl:text-sm", isFocused ? "color-accent-500 font-semibold" : "")}>
                {title}
            </Text>
        </Pressable>
    );
});

export default function TabLayout() {
    const edgeInsets = useSafeAreaInsets();
    const edgeInsetsTab = simpleCopy(edgeInsets);
    const windowDimensions = useWindowDimensions();

    if (windowDimensions.width < breakpoints.md) {
        edgeInsetsTab.bottom = edgeInsets.bottom + 64;
    }
    if (windowDimensions.width >= breakpoints.md) {
        edgeInsetsTab.left = edgeInsets.left + 64;
    }
    if (windowDimensions.width >= breakpoints.xl) {
        edgeInsetsTab.left = edgeInsets.left + 256;
    }

    return (
        <TabSafeAreaContext.Provider value={edgeInsetsTab}>
            <Tabs>
                <TabSlot />
                <TabList
                    className={
                        "absolute left-0 bottom-0 px-safe pb-safe !flex-row !justify-around bg-background-50 " +
                        "max-md:w-full md:h-full md:!flex-col md:pr-0 md:pt-safe md:!justify-start " +
                        "xl:w-64 xl:items-center"
                    }
                >
                    <View className={"hidden md:flex h-3 xl:h-4"} aria-hidden={true} />
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
        </TabSafeAreaContext.Provider>
    );
}
