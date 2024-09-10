import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { filesize } from "filesize";
import path from "path-browserify";
import React from "react";
import TrackPlayer from "react-native-track-player";

import CommonLayout from "~/components/CommonLayout";
import SettingMenuItem from "~/components/SettingMenuItem";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { BILISOUND_OFFLINE_PATH } from "~/constants/file";
import { checkDirectorySize, cleanAudioCache } from "~/utils/misc";

const DeleteIcon = createIcon(MaterialIcons, "delete");

async function countSize() {
    const tracks = await TrackPlayer.getQueue();
    const cacheSize = await checkDirectorySize(BILISOUND_OFFLINE_PATH);
    const cacheFreeSize = await checkDirectorySize(BILISOUND_OFFLINE_PATH, {
        fileFilter(fileName) {
            const name = path.parse(fileName).name;
            return !tracks.find(e => `${e.bilisoundId}_${e.bilisoundEpisode}` === name);
        },
    });
    return { cacheSize, cacheFreeSize };
}

export default function Page() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["count_size"],
        queryFn: countSize,
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
            <SettingMenuItem icon={DeleteIcon} title="导出全部歌单" subTitle="TODO" disabled />
        </CommonLayout>
    );
}
