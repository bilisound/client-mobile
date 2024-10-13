import React from "react";
import { GestureResponderEvent, View } from "react-native";

import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { IconComponent } from "~/components/potato-ui/utils/icon";
import { Text } from "~/components/ui/text";

export interface SettingMenuItemProps {
    title: string;
    subTitle?: string;
    icon: IconComponent;
    iconSize?: number;
    rightAccessories?: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    disabled?: boolean;
}

export default function SettingMenuItem({
    title,
    subTitle,
    icon,
    iconSize = 24,
    rightAccessories,
    onPress,
    disabled,
}: SettingMenuItemProps) {
    const Icon = icon;

    const inner = (
        <View className={`flex-row p-4 gap-3 items-start ${disabled ? "opacity-60" : ""}`}>
            <View className="flex-1">
                <View className="flex-row items-center gap-3">
                    <View className="size-6 items-center justify-center">
                        <Icon size={iconSize} className="color-typography-700" />
                    </View>
                    <Text className="font-semibold text-[15px]">{title}</Text>
                </View>
                {subTitle ? <Text className="mt-1 ml-9 opacity-60 text-[15px] leading-normal">{subTitle}</Text> : null}
            </View>
            {rightAccessories ? <View className="flex-0 basis-auto">{rightAccessories}</View> : null}
        </View>
    );

    if (!onPress || disabled) {
        return inner;
    }

    return <PotatoPressable onPress={onPress}>{inner}</PotatoPressable>;
}
