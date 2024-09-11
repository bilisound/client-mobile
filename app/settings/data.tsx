import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { filesize } from "filesize";
import React from "react";

import CommonLayout from "~/components/CommonLayout";
import SettingMenuItem from "~/components/SettingMenuItem";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { exportPlaylistToFile } from "~/utils/exchange/playlist";
import { cleanAudioCache, countSize } from "~/utils/misc";

const DeleteIcon = createIcon(MaterialIcons, "delete");
const ExportIcon = createIcon(Entypo, "export");

export default function Page() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["count_size"],
        queryFn: countSize,
        staleTime: 30000,
    });

    return (
        <CommonLayout titleBarTheme="solid" title="数据管理" leftAccessories="backButton">
            <SettingMenuItem
                icon={DeleteIcon}
                title="清除离线缓存"
                subTitle={
                    data && !isLoading
                        ? `共占用 ${filesize(data.cacheSize)} (${filesize(data.cacheFreeSize)} 可清除)`
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
        </CommonLayout>
    );
}
