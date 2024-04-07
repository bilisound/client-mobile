import { Box, Pressable, Text } from "@gluestack-ui/themed";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { router } from "expo-router";
import { useCallback } from "react";
import { v4 } from "uuid";

import CommonLayout from "../../../components/CommonLayout";
import Empty from "../../../components/Empty";
import { COMMON_TOUCH_COLOR } from "../../../constants/style";
import { PlaylistMeta, usePlaylistStorage } from "../../../storage/playlist";

function PlaylistItem(info: ListRenderItemInfo<PlaylistMeta>) {
    return (
        <Pressable
            gap="$1"
            px="$5"
            py="$3"
            sx={COMMON_TOUCH_COLOR}
            onPress={() => {
                router.push(`/(tabs)/(stack)/detail/${info.item.id}`);
            }}
        >
            <Box flexDirection="row" alignItems="center" gap="$3">
                <Box w="$3" h="$3" bg={info.item.color} borderRadius="$full" />
                <Text fontSize="$md" lineHeight={24}>
                    {info.item.title}
                </Text>
            </Box>
            <Text ml="$6" fontSize="$sm" opacity={0.6} lineHeight={21}>
                4 首歌曲
            </Text>
        </Pressable>
    );
}

export default function Page() {
    const [list, setList] = usePlaylistStorage();

    const handleAdd = useCallback(() => {
        setList(prevValue => {
            return [
                ...prevValue,
                {
                    id: v4(),
                    title: "测试列表项目",
                    color: "#66ccff",
                },
            ];
        });
    }, [setList]);

    return (
        <CommonLayout title="播放列表" titleBarTheme="transparent" extendToBottom>
            {list.length <= 0 ? (
                <Empty action="添加新列表" onPress={() => handleAdd()} />
            ) : (
                <FlashList renderItem={PlaylistItem} data={list} estimatedItemSize={73} />
            )}
        </CommonLayout>
    );
}
