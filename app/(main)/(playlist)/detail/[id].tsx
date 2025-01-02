import { Text } from "~/components/ui/text";
import { TabSafeAreaView, useTabSafeAreaInsets } from "~/hooks/useTabSafeAreaInsets";
import { useLocalSearchParams } from "expo-router";
import { usePlaylistOnQueue } from "~/storage/playlist";
import { getPlaylistDetail, getPlaylistMeta } from "~/storage/sqlite/playlist";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "~/components/layout";
import { FlashList } from "@shopify/flash-list";
import { SongItem } from "~/components/song-item";

export default function Page() {
    const edgeInsets = useTabSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [playlistOnQueue = {}, setPlaylistOnQueue] = usePlaylistOnQueue();

    const { data: metaRaw } = useQuery({
        queryKey: [`playlist_meta_${id}`],
        queryFn: () => getPlaylistMeta(Number(id)),
    });

    const meta = metaRaw?.[0];

    const queryClient = useQueryClient();
    const { data: playlistDetail = [] } = useQuery({
        queryKey: [`playlist_detail_${id}`],
        queryFn: () => getPlaylistDetail(Number(id)),
    });

    return (
        <Layout title={"查看详情"} leftAccessories={"BACK_BUTTON"} edgeInsets={edgeInsets}>
            <FlashList
                data={playlistDetail}
                renderItem={e => <SongItem data={e.item} index={e.index + 1} />}
                estimatedItemSize={64}
            />
        </Layout>
    );
}
