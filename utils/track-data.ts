import { Asset } from "expo-asset";
import RNFS from "react-native-fs";
import TrackPlayer, { AddTrack, Track } from "react-native-track-player";
import { v4 as uuidv4 } from "uuid";

import log from "./logger";
import { getCacheAudioPath } from "./misc";
import { runTasksLimit } from "./promise";
import { convertToHTTPS } from "./string";
import { BILISOUND_OFFLINE_PATH, BILISOUND_PERSIST_QUEUE_PATH } from "../constants/file";
import { PlaylistDetailRow } from "../storage/playlist";

export async function saveTrackData() {
    const tracks = await TrackPlayer.getQueue();
    const current = await TrackPlayer.getActiveTrackIndex();

    await RNFS.writeFile(
        BILISOUND_PERSIST_QUEUE_PATH,
        JSON.stringify({ tracks, current }, (key, value) => {
            if (key === "url") {
                return undefined;
            }
            return value;
        }),
        "utf8",
    );
}

export async function loadTrackData() {
    if (await RNFS.exists(BILISOUND_PERSIST_QUEUE_PATH)) {
        const raw = await RNFS.readFile(BILISOUND_PERSIST_QUEUE_PATH, "utf8");
        const data = JSON.parse(raw);
        const tracks: AddTrack[] = data?.tracks ?? [];
        tracks.forEach(e => {
            if (typeof e.bilisoundIsLoaded === "undefined") {
                e.bilisoundIsLoaded = true;
            }
            if (e.bilisoundIsLoaded) {
                e.url = `file://${encodeURI(`${BILISOUND_OFFLINE_PATH}/${e.bilisoundId}_${e.bilisoundEpisode}.m4a`)}`;
            } else {
                // 使用 `setQueue()` 添加的曲目，url 需要手动转换成 `Asset` 对象。然而使用 `add()` 添加就不需要……
                e.url = Asset.fromModule(require("../assets/placeholder.mp3")) as any;
            }
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
        url: Asset.fromModule(require("../assets/placeholder.mp3")) as any,
        title: e.title,
        artist: e.author,
        artwork: convertToHTTPS(e.imgUrl),
        duration: e.duration,
        bilisoundId: e.bvid,
        bilisoundEpisode: e.episode,
        bilisoundUniqueId: uuidv4(),
        bilisoundIsLoaded: false,
    }));
    const tasks: any[] = [];
    newTracks.forEach((e, i) => {
        tasks.push(async () => {
            const url = getCacheAudioPath(e.bilisoundId, e.bilisoundEpisode);
            try {
                const found = await RNFS.exists(url);
                // log.debug("检测 " + url + " 是否存在。结果：" + found);
                if (found) {
                    e.url = url;
                    e.bilisoundIsLoaded = true;
                }
            } catch (e) {
                log.error(`检测 ${url} 的存在时发生了预期外的错误`, e);
            }
        });
    });
    await runTasksLimit(tasks, 50);
    return newTracks;
}
