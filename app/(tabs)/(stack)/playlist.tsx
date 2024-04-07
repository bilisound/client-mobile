import { Box, Pressable, Text } from "@gluestack-ui/themed";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { router } from "expo-router";

import CommonLayout from "../../../components/CommonLayout";
import { COMMON_TOUCH_COLOR } from "../../../constants/style";

const data = new Array(30).fill(null).map((_, i) => ({
    id: i,
    name: "测试列表",
    color: `hsl(${Math.random() * 360}, 80%, 50%)`,
}));

function PlaylistItem(info: ListRenderItemInfo<(typeof data)[number]>) {
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
                    {info.item.name}
                </Text>
            </Box>
            <Text ml="$6" fontSize="$sm" opacity={0.6} lineHeight={21}>
                4 首歌曲
            </Text>
        </Pressable>
    );
}

export default function Page() {
    return (
        <CommonLayout title="播放列表" titleBarTheme="transparent" extendToBottom>
            <FlashList renderItem={PlaylistItem} data={data} estimatedItemSize={73} />
        </CommonLayout>
    );
}
