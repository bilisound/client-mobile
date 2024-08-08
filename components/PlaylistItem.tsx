import { Box, Center, Text } from "@gluestack-ui/themed";
import React from "react";

import Pressable from "~/components/ui/Pressable";
import { PlaylistMeta } from "~/storage/playlist";

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
        <Pressable
            style={[{ gap: 4, paddingHorizontal: 20, paddingVertical: 12 }]}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <Box flexDirection="row" alignItems="center" gap="$3">
                <Center w={24} h={24} flex={0} flexBasis="auto">
                    <Box w="$3.5" h="$3.5" bg={item.color} borderRadius="$full" />
                </Center>
                <Text fontSize="$md" lineHeight={24} numberOfLines={1} ellipsizeMode="tail" flex={1}>
                    {item.title}
                </Text>
            </Box>
            <Text ml="$9" fontSize="$sm" opacity={0.6} lineHeight={21}>
                {`${item.amount} 首歌曲`}
            </Text>
        </Pressable>
    );
}
