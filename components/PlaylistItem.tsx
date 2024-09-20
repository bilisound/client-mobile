import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { View } from "react-native";

import PotatoPressable from "./potato-ui/PotatoPressable";

import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { PlaylistMeta } from "~/storage/sqlite/schema";

export interface PlaylistItemProps {
    item: PlaylistMeta;
    onPress?: () => void;
    onLongPress?: () => void;
}

/**
 * 歌单列表项
 */
export default function PlaylistItem({ item, onPress, onLongPress }: PlaylistItemProps) {
    let title = item.title;

    if (process.env.NODE_ENV !== "production") {
        title = `[${item.id}] ${title}`;
    }

    return (
        <PotatoPressable className="gap-1 px-5 py-3" onPress={onPress} onLongPress={onLongPress}>
            <Box className="flex-row items-center gap-3">
                <View className="w-6 h-6 items-center justify-center basis-auto">
                    {item.source ? (
                        <Entypo name="cloud" size={20} color={item.color} />
                    ) : (
                        <Box className="w-[14px] h-[14px] rounded-full" style={[{ backgroundColor: item.color }]} />
                    )}
                </View>
                <Text className="text-base leading-normal flex-1" numberOfLines={1} ellipsizeMode="tail">
                    {title}
                </Text>
            </Box>
            <Text className="ml-9 text-sm opacity-60 leading-normal">{`${item.amount} 首歌曲`}</Text>
        </PotatoPressable>
    );
}
