import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { filesize } from "filesize";
import React from "react";

import { exportPlaylistToFile } from "~/utils/exchange/playlist";
import { cleanAudioCache, countSize } from "~/utils/file";
import { createIcon } from "~/components/icon";
import { Layout } from "~/components/layout";
import { SettingMenuItem } from "~/components/setting-menu";

const DeleteIcon = createIcon(MaterialIcons, "delete");
const ExportIcon = createIcon(Entypo, "export");

export default function Page() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["count_size"],
        queryFn: countSize,
        staleTime: 30000,
    });

    return (
        <Layout title="数据管理" leftAccessories="BACK_BUTTON">
            <SettingMenuItem
                icon={DeleteIcon}
                title="清除离线缓存"
                subTitle={
                    data && !isLoading
                        ? data.cacheFreeSize <= 0
                            ? "目前没有可供清除的缓存"
                            : `${filesize(data.cacheFreeSize)} 可清除`
                        : "占用空间统计中……"
                }
                onPress={async () => {
                    await cleanAudioCache();
                    await refetch();
                }}
                disabled={!data || data.cacheFreeSize <= 0}
            />
            <SettingMenuItem
                icon={ExportIcon}
                title="导出全部歌单"
                subTitle="导出的歌单可以在其它设备导入"
                onPress={() => exportPlaylistToFile()}
            />
        </Layout>
    );
}
