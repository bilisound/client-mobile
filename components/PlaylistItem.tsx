import { Box, Center, Pressable, Text } from "@gluestack-ui/themed";
import React from "react";

import { COMMON_TOUCH_COLOR } from "../constants/style";
import { PlaylistMeta } from "../storage/playlist";

export interface PlaylistItemProps {
    item: PlaylistMeta;
    onPress?: () => void;
    onLongPress?: () => void;
}

/**
 * 歌单列表项
 */
export default function PlaylistItem({ item, onPress, onLongPress }: PlaylistItemProps) {
    return (
        <Pressable gap="$1" px="$5" py="$3" sx={COMMON_TOUCH_COLOR} onPress={onPress} onLongPress={onLongPress}>
            <Box flexDirection="row" alignItems="center" gap="$3">
                <Center w={24} h={24}>
                    <Box w="$3" h="$3" bg={item.color} borderRadius="$full" />
                </Center>
                <Text fontSize="$md" lineHeight={24} numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                </Text>
            </Box>
            <Text ml="$9" fontSize="$sm" opacity={0.6} lineHeight={21}>
                {`${item.amount} 首歌曲`}
            </Text>
        </Pressable>
    );
}
