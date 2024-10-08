import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { twMerge } from "tailwind-merge";

import PotatoButton from "~/components/potato-ui/PotatoButton";

export interface EmptyProps {
    onPress?: () => void;
    title?: string;
    action?: string | null;
    className?: string;
    style?: StyleProp<ViewStyle>;
}

export default function Empty({
    onPress = () => {},
    title = "这里空空如也",
    action = "去查询",
    style,
    className,
}: EmptyProps) {
    return (
        <View className={twMerge("items-center justify-center grow gap-4", className)} style={style}>
            <Text className="text-sm leading-normal opacity-50 text-typography-700">{title}</Text>
            {action && <PotatoButton onPress={onPress}>{action}</PotatoButton>}
        </View>
    );
}
