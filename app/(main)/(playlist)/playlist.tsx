import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlaylistMetas } from "~/storage/sqlite/playlist";
import { Layout, LayoutButton } from "~/components/layout";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { PlaylistItem } from "~/components/playlist-item";
import { Menu, MenuItem, MenuItemLabel } from "~/components/ui/menu";
import { Monicon } from "@monicon/native";
import { Box } from "~/components/ui/box";
import { useTabSafeAreaInsets } from "~/hooks/useTabSafeAreaInsets";
import { importPlaylistFromFile } from "~/utils/exchange/playlist";

export default function Page() {
    const edgeInsets = useTabSafeAreaInsets();
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ["playlist_meta"],
        queryFn: () => getPlaylistMetas(),
    });

    const handleImport = async () => {
        const result = await importPlaylistFromFile();
        if (result) {
            await queryClient.invalidateQueries({ queryKey: ["playlist_meta"] });
            await queryClient.invalidateQueries({ queryKey: ["playlist_meta_apply"] });
        }
    };

    // todo 实现编辑和删除功能

    return (
        <Layout
            edgeInsets={edgeInsets}
            title={"歌单"}
            leftAccessories={"BACK_BUTTON"}
            rightAccessories={
                <>
                    <LayoutButton iconName={"uil:qrcode-scan"} aria-label={"扫描二维码"} iconSize={22} />
                    <Menu
                        placement="bottom right"
                        offset={5}
                        disabledKeys={["Settings"]}
                        trigger={({ ...triggerProps }) => {
                            return (
                                <LayoutButton
                                    iconName={"fa6-solid:plus"}
                                    aria-label={"添加或导入歌单"}
                                    {...triggerProps}
                                />
                            );
                        }}
                    >
                        <MenuItem key="create" textValue="创建新歌单">
                            <Box className={"size-4 items-center justify-center mr-3"}>
                                <Monicon name={"fa6-solid:plus"} size={16} className={"text-typography-700"} />
                            </Box>
                            <MenuItemLabel>创建新歌单</MenuItemLabel>
                        </MenuItem>
                        <MenuItem key="import" textValue="导入歌单" onPress={handleImport}>
                            <Box className={"size-4 items-center justify-center mr-3"}>
                                <Monicon name={"fa6-solid:file-import"} size={16} className={"text-typography-700"} />
                            </Box>
                            <MenuItemLabel>导入歌单</MenuItemLabel>
                        </MenuItem>
                    </Menu>
                </>
            }
        >
            <FlashList data={data} renderItem={e => <PlaylistItem item={e.item} />} estimatedItemSize={80} />
        </Layout>
    );
}
