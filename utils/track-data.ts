import RNFS from "react-native-fs";
import TrackPlayer from "react-native-track-player";
import { Track } from "react-native-track-player/lib/interfaces";
import { BILISOUND_OFFLINE_PATH, BILISOUND_PLAYLIST_PATH } from "../constants/file";

export async function saveTrackData() {
    const tracks = await TrackPlayer.getQueue();
    const current = await TrackPlayer.getActiveTrackIndex();

    tracks.forEach((e) => {
        e.url = "";
    });

    await RNFS.writeFile(BILISOUND_PLAYLIST_PATH, JSON.stringify({ tracks, current }), "utf8");
}

export async function loadTrackData() {
    if (await RNFS.exists(BILISOUND_PLAYLIST_PATH)) {
        const raw = await RNFS.readFile(BILISOUND_PLAYLIST_PATH, "utf8");
        const data = JSON.parse(raw);
        const tracks: Track[] = data?.tracks ?? [];
        tracks.forEach((e) => {
            e.url = `file://${encodeURI(`${BILISOUND_OFFLINE_PATH}/${e.bilisoundId}_${e.bilisoundEpisode}.m4a`)}`;
        });

        await TrackPlayer.setQueue(data?.tracks ?? []);
        if (data.current) {
            await TrackPlayer.skip(data.current);
        }
        await TrackPlayer.stop();
    }
}
