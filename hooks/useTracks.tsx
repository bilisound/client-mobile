import { useEffect, useState } from "react";
import { Track } from "react-native-track-player";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import { saveTrackData } from "../utils/track-data";
import log from "../utils/logger";

const useTracks = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const activeTrack = useActiveTrack();

    const update = async () => {
        setTracks(await TrackPlayer.getQueue());
        try {
            await saveTrackData();
            log.debug("播放列表保存成功");
        } catch (e) {
            log.error(`播放列表保存失败。错误信息：${e}`);
        }
    };

    useEffect(() => {
        (async () => {
            await update();
        })();
    }, [activeTrack]);

    return { tracks, update };
};

export default useTracks;
