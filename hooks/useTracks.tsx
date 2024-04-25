import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";

import log from "../utils/logger";
import { saveTrackData } from "../utils/track-data";
const useTracks = () => {
    const { data, refetch } = useQuery({
        queryKey: ["tracks"],
        queryFn: TrackPlayer.getQueue,
    });
    const activeTrack = useActiveTrack();
    const update = useCallback(async () => {
        await refetch();
        try {
            await saveTrackData();
            log.debug("播放列表保存成功");
        } catch (e) {
            log.error(`播放列表保存失败。错误信息：${e}`);
        }
    }, [refetch]);
    useEffect(() => {
        update();
    }, [activeTrack, update]);
    return {
        tracks: data || [],
        update,
    };
};
export default useTracks;
