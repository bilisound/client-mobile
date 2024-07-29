import TrackPlayer, { AddTrack, Track } from "react-native-track-player";
import { v4 as uuidv4 } from "uuid";

import { convertToHTTPS } from "./string";

import { BILISOUND_API_PREFIX } from "~/constants/network";
import { BILISOUND_PERSIST_QUEUE } from "~/constants/web";
import { PlaylistDetailRow } from "~/storage/playlist";
import { getOnlineUrl } from "~/utils/constant-helper";

export async function saveTrackData() {
    const tracks = await TrackPlayer.getQueue();
    const current = await TrackPlayer.getActiveTrackIndex();

    localStorage[BILISOUND_PERSIST_QUEUE] = JSON.stringify({ tracks, current }, (key, value) => {
        if (key === "url") {
            return undefined;
        }
        return value;
    });
}

export async function loadTrackData() {
    if (localStorage[BILISOUND_PERSIST_QUEUE]) {
        const data = JSON.parse(localStorage[BILISOUND_PERSIST_QUEUE]);
        const tracks: AddTrack[] = data?.tracks ?? [];
        tracks.forEach(e => {
            e.url = getOnlineUrl(e.bilisoundId, e.bilisoundEpisode);
        });

        await TrackPlayer.setQueue(data?.tracks ?? []);
        if (data.current) {
            await TrackPlayer.skip(data.current);
        }
        await TrackPlayer.stop();
    }
}

export async function playlistToTracks(input: PlaylistDetailRow[]) {
    const newTracks: Track[] = input.map(e => ({
        url: BILISOUND_API_PREFIX + getOnlineUrl(e.bvid, e.episode),
        title: e.title,
        artist: e.author,
        artwork: convertToHTTPS(e.imgUrl),
        duration: e.duration,
        bilisoundId: e.bvid,
        bilisoundEpisode: e.episode,
        bilisoundUniqueId: uuidv4(),
        bilisoundIsLoaded: false,
    }));
    return newTracks;
}

export function tracksToPlaylist(input: Track[]): PlaylistDetailRow[] {
    return input.map(e => ({
        author: e.artist ?? "",
        bvid: e.bilisoundId,
        duration: e.duration ?? 0,
        episode: e.bilisoundEpisode,
        title: e.title ?? "",
        imgUrl: e.artwork ?? "",
    }));
}
