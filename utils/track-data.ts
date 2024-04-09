import RNFS from "react-native-fs";
import TrackPlayer, { Track } from "react-native-track-player";

import { BILISOUND_OFFLINE_PATH, BILISOUND_PERSIST_QUEUE_PATH } from "../constants/file";

export async function saveTrackData() {
    const tracks = await TrackPlayer.getQueue();
    const current = await TrackPlayer.getActiveTrackIndex();

    tracks.forEach(e => {
        e.url = "";
    });

    await RNFS.writeFile(BILISOUND_PERSIST_QUEUE_PATH, JSON.stringify({ tracks, current }), "utf8");
}

export async function loadTrackData() {
    if (await RNFS.exists(BILISOUND_PERSIST_QUEUE_PATH)) {
        const raw = await RNFS.readFile(BILISOUND_PERSIST_QUEUE_PATH, "utf8");
        const data = JSON.parse(raw);
        const tracks: Track[] = data?.tracks ?? [];
        tracks.forEach(e => {
            e.url = `file://${encodeURI(`${BILISOUND_OFFLINE_PATH}/${e.bilisoundId}_${e.bilisoundEpisode}.m4a`)}`;
            if (typeof e.bilisoundIsLoaded === "undefined") {
                e.bilisoundIsLoaded = true;
            }
        });

        await TrackPlayer.setQueue(data?.tracks ?? []);
        if (data.current) {
            await TrackPlayer.skip(data.current);
        }
        await TrackPlayer.stop();
    }
}
