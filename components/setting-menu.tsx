import React from "react";
import { GestureResponderEvent, Pressable, View } from "react-native";

import { IconComponent } from "~/components/icon";
import { Text } from "~/components/ui/text";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";

export interface SettingMenuItemProps {
    title: string;
    subTitle?: string;
    icon: IconComponent;
    iconSize?: number;
    rightAccessories?: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    disabled?: boolean;
}

export function SettingMenuItem({
    title,
    subTitle,
    icon,
    iconSize = 24,
    rightAccessories,
    onPress,
    disabled,
}: SettingMenuItemProps) {
    const { colorValue } = useRawThemeValues();

    const Icon = icon;

    const inner = (
        <View className={`flex-row p-4 gap-3 items-start ${disabled ? "opacity-60" : ""}`}>
            <View className="flex-1">
                <View className="flex-row items-center gap-3">
                    <View className="size-6 items-center justify-center">
                        <Icon size={iconSize} className="color-typography-700" />
                    </View>
                    <Text className="font-semibold text-[0.9375rem]">{title}</Text>
                </View>
                {subTitle ? (
                    <Text className="mt-1 ml-9 opacity-60 text-[0.9375rem] leading-normal">{subTitle}</Text>
                ) : null}
            </View>
            {rightAccessories ? <View className="flex-0 basis-auto">{rightAccessories}</View> : null}
        </View>
    );

    if (!onPress || disabled) {
        return inner;
    }

    return (
        <Pressable
            onPress={onPress}
            android_ripple={{
                color: colorValue("--color-background-100"),
            }}
        >
            {inner}
        </Pressable>
    );
}
