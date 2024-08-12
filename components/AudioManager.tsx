import React from "react";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { Event, useTrackPlayerEvents } from "react-native-track-player";
import { getActiveTrack, getActiveTrackIndex, getTrack } from "react-native-track-player/lib/src/trackPlayer";

import useSettingsStore from "~/store/settings";
import { handleReDownload } from "~/utils/download-service";
import log from "~/utils/logger";

const events = [Event.PlaybackState, Event.PlaybackError, Event.PlaybackActiveTrackChanged];

const AudioManager: React.FC = () => {
    useTrackPlayerEvents(events, async event => {
        if (event.type === Event.PlaybackError) {
            Toast.show({
                type: "error",
                text1: "操作失败",
                text2: "目前无法播放这个曲目",
            });
            log.error(`无法播放所请求的曲目。原因：${JSON.stringify(event)}`);
        }
        if (event.type === Event.PlaybackActiveTrackChanged) {
            await handleReDownload({ activeTrack: await getActiveTrack() });
            if (Platform.OS === "web" || !useSettingsStore.getState().downloadNextTrack) {
                return;
            }
            log.debug("尝试下载队列中下一首歌曲");
            const index = ((await getActiveTrackIndex()) ?? -1) + 1;
            const nextTrack = await getTrack(index);
            if (nextTrack) {
                await handleReDownload({ activeTrack: nextTrack, activeTrackIndex: index });
            }
        }
    });

    return null;
};

export default AudioManager;
