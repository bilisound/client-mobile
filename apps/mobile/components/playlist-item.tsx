import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleProp, ViewStyle, View } from "react-native";
import { twMerge } from "tailwind-merge";

import { Text } from "~/components/ui/text";
import { PlaylistMeta } from "~/storage/sqlite/schema";
import { Pressable } from "~/components/ui/pressable";

export interface PlaylistItemProps {
    item: PlaylistMeta;
    onPress?: () => void;
    onLongPress?: () => void;
    className?: string;
    style?: StyleProp<ViewStyle>;
}

/**
 * 歌单列表项
 */
export function PlaylistItem({ item, onPress, onLongPress, className, style }: PlaylistItemProps) {
    let title = item.title;

    /*if (process.env.NODE_ENV !== "production") {
        title = `[${item.id}] ${title}`;
    }*/

    return (
        <Pressable
            className={twMerge("gap-1 px-5 py-3", className)}
            style={style}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <View className="flex-row items-center gap-3">
                <View className="w-6 h-6 items-center justify-center basis-auto">
                    {item.source ? (
                        <Entypo name="cloud" size={20} color={item.color} />
                    ) : (
                        <View
                            className="w-[0.875rem] h-[0.875rem] rounded-full"
                            style={[{ backgroundColor: item.color }]}
                        />
                    )}
                </View>
                <Text className="text-base leading-normal flex-1" isTruncated>
                    {title}
                </Text>
            </View>
            <Text className="ml-9 text-sm opacity-60 leading-normal">{`${item.amount} 首歌曲`}</Text>
        </Pressable>
    );
}
