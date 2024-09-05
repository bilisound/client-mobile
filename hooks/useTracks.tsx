import { useSyncExternalStore } from "react";
import TrackPlayer, { Event, Track } from "react-native-track-player";

import log from "~/utils/logger";
import { saveTrackData } from "~/utils/track-data";

const state = {
    callbackCount: 1,
    snapshot: {
        tracks: [] as Track[],
        async update() {
            state.snapshot = {
                ...state.snapshot,
                tracks: await TrackPlayer.getQueue(),
            };
            try {
                await saveTrackData();
                log.debug("队列保存成功");
            } catch (e) {
                log.error(`队列保存失败。错误信息：${e}`);
            }
            callbackMap.forEach(value => value());
        },
    },
};
const callbackMap = new Map<number, () => void>();

// 事件绑定（但是目前没有队列变化的事件……）
TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, event => {
    state.snapshot.update();
});

state.snapshot.update();

export default function useTracks() {
    return useSyncExternalStore(
        onStoreChange => {
            const selfId = state.callbackCount;
            callbackMap.set(selfId, onStoreChange);
            state.callbackCount += 1;
            return () => {
                callbackMap.delete(selfId);
            };
        },
        () => state.snapshot,
    );
}
