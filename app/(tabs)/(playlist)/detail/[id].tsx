import { useColorMode } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import Color from "color";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useMMKVStorage } from "react-native-mmkv-storage";

import CommonLayout from "../../../../components/CommonLayout";
import SongItem from "../../../../components/SongItem";
import {
    PLAYLIST_ITEM_KEY_PREFIX,
    PlaylistDetailRow,
    playlistStorage,
    usePlaylistStorage,
} from "../../../../storage/playlist";

export default function Page() {
    const colorMode = useColorMode();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [playlistMeta] = usePlaylistStorage();
    const [playlistDetail] = useMMKVStorage<PlaylistDetailRow[]>(PLAYLIST_ITEM_KEY_PREFIX + id, playlistStorage, []);

    const meta = playlistMeta.find(e => e.id === id);

    if (!meta) {
        return null;
    }

    const fromColor = Color(meta.color)
        .lightness(colorMode === "dark" ? 20 : 90)
        .saturationl(100)
        .toString();

    return (
        <CommonLayout
            title="查看详情"
            solidColor={fromColor}
            solidScheme={colorMode as "light" | "dark"}
            leftAccessories="backButton"
        >
            <LinearGradient
                colors={[`${fromColor}`, `transparent`]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                style={{
                    width: "100%",
                    height: 250,
                }}
                aria-hidden
            />
            <FlashList
                renderItem={item => {
                    return <SongItem data={item.item} index={item.index + 1} />;
                }}
                data={playlistDetail}
                estimatedItemSize={68}
            />
        </CommonLayout>
    );
}
