import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";

import PotatoPressable from "~/components/potato-ui/PotatoPressable";
import { Text } from "~/components/ui/text";

export interface VideoItemProps {
    onPress?: () => void;
    image: string;
    text1: string;
    text2: string;
}

export function VideoItem({ onPress, image, text1, text2 }: VideoItemProps) {
    const inner = (
        <>
            <Image source={image} className="h-12 aspect-[3/2] flex-0 basis-auto rounded-lg" />
            <View className="flex-1 gap-1">
                <Text className="font-semibold text-sm leading-normal" ellipsizeMode="tail" numberOfLines={1}>
                    {text1}
                </Text>
                <Text className="text-xs opacity-50 leading-normal" ellipsizeMode="tail" numberOfLines={1}>
                    {text2}
                </Text>
            </View>
        </>
    );

    if (onPress) {
        return (
            <PotatoPressable onPress={onPress} className="flex-row items-center py-3 px-4 gap-4">
                {inner}
            </PotatoPressable>
        );
    }

    return <View className="flex-row items-center py-3 px-4 gap-4">{inner}</View>;
}
