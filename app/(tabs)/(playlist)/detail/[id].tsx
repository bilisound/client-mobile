import { Text } from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";
import { useMMKVStorage } from "react-native-mmkv-storage";

import CommonLayout from "../../../../components/CommonLayout";
import { PLAYLIST_ITEM_KEY_PREFIX, PlaylistDetailRow, playlistStorage } from "../../../../storage/playlist";

export default function Page() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [playlistDetail] = useMMKVStorage<PlaylistDetailRow[]>(PLAYLIST_ITEM_KEY_PREFIX + id, playlistStorage, []);

    return (
        <CommonLayout title="查看详情" titleBarTheme="transparent" leftAccessories="backButton">
            <Text>你正在查看 {id}</Text>
            <Text>{JSON.stringify(playlistDetail, null, 4)}</Text>
        </CommonLayout>
    );
}
