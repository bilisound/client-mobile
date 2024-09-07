import { Asset } from "expo-asset";
import RNFS from "react-native-fs";
import TrackPlayer, { AddTrack, Track } from "react-native-track-player";
import { v4 as uuidv4 } from "uuid";

import log from "./logger";
import { getCacheAudioPath } from "./misc";
import { runTasksLimit } from "./promise";
import { convertToHTTPS } from "./string";

import { BILISOUND_OFFLINE_PATH } from "~/constants/file";
import {
    QUEUE_CURRENT_INDEX,
    QUEUE_IS_RANDOMIZED,
    QUEUE_LIST,
    QUEUE_LIST_BACKUP,
    QUEUE_PLAYING_MODE,
    QueuePlayingMode,
    queueStorage,
} from "~/storage/queue";
import { PlaylistDetail } from "~/storage/sqlite/schema";
import { handleLegacyQueue } from "~/utils/migration/legacy-queue";

export async function saveTrackData() {
    await Promise.all([
        (async () => {
            const tracks = await TrackPlayer.getQueue();
            queueStorage.set(
                QUEUE_LIST,
                JSON.stringify(tracks, (key, value) => {
                    if (key === "url") {
                        return undefined;
                    }
                    return value;
                }),
            );
            if (!queueStorage.getBoolean(QUEUE_IS_RANDOMIZED)) {
                queueStorage.set(
                    QUEUE_LIST_BACKUP,
                    JSON.stringify(tracks, (key, value) => {
                        if (key === "url") {
                            return undefined;
                        }
                        return value;
                    }),
                );
            }
        })(),
        (async () => {
            const current = await TrackPlayer.getActiveTrackIndex();
            queueStorage.set(QUEUE_CURRENT_INDEX, current || 0);
        })(),
    ]);
}

export async function loadTrackData(fromBackup = false) {
    let tracks: AddTrack[] = [];
    let current = 0;

    if (queueStorage.contains(fromBackup ? QUEUE_LIST_BACKUP : QUEUE_LIST)) {
        tracks = JSON.parse(queueStorage.getString(fromBackup ? QUEUE_LIST_BACKUP : QUEUE_LIST) ?? "[]");
        current = queueStorage.getNumber(QUEUE_CURRENT_INDEX) || 0;
    }

    const tryMigrate = await handleLegacyQueue();
    if (tryMigrate) {
        tracks = tryMigrate.tracks;
        current = tryMigrate.current;
    }

    // 载入 tracks 和 current
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
    return { tracks, current };
}

export async function playlistToTracks(input: PlaylistDetail[]) {
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

export function tracksToPlaylist(input: Track[]): PlaylistDetail[] {
    return input.map(e => ({
        author: e.artist ?? "",
        bvid: e.bilisoundId,
        duration: e.duration ?? 0,
        episode: e.bilisoundEpisode,
        title: e.title ?? "",
        imgUrl: e.artwork ?? "",
        // 注意，这里的 id 和 playlistId 需要在事后填充
        id: 0,
        playlistId: 0,
        extendedData: null,
    }));
}

function shuffleInPlace<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * 切换播放模式
 */
export async function setMode() {
    const mode = queueStorage.getString(QUEUE_PLAYING_MODE) as QueuePlayingMode | undefined;

    switch (mode) {
        case "shuffle": {
            const { tracks } = await loadTrackData(true);
            // todo 此函数切换回普通模式时会出问题
            await setQueueUninterrupted(tracks);
            queueStorage.set(QUEUE_PLAYING_MODE, "normal");
            queueStorage.set(QUEUE_IS_RANDOMIZED, false);
            break;
        }
        case "normal":
        default: {
            await shuffle();
            queueStorage.set(QUEUE_PLAYING_MODE, "shuffle");
            queueStorage.set(QUEUE_IS_RANDOMIZED, true);
            break;
        }
    }
}

// 修改自 https://github.com/doublesymmetry/react-native-track-player/issues/1711#issuecomment-1529325813
/**
 * shuffles the current Queue. The method returns a pre-shuffled Queue,
 * to revert shuffling, use setQueueUninterrupted().
 */
export async function shuffle(): Promise<Track[]> {
    const currentQueue = await TrackPlayer.getQueue();
    const shuffledQueue = currentQueue.concat();
    shuffleInPlace(shuffledQueue);
    await setQueueUninterrupted(shuffledQueue);
    return currentQueue;
}

/**
 * This is a combination of removePreviousTracks() and removeUpcomingTracks().
 * To set the player's queue without playback interruption, remove
 * all tracks with remove() that are not the activeTrackIndex. The current
 * track will be automatically shifted to the first element. Then, splice tracks that
 * the currentTrack is at the first element, and add the spliced tracks.
 * @param tracks
 */
export async function setQueueUninterrupted(tracks: Track[], forRestore = false): Promise<void> {
    // if no currentTrack, its a simple setQueue
    const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
    log.debug(`setQueueUninterrupted: currentTrackIndex is valid? ${JSON.stringify({ currentTrackIndex })}`);
    if (currentTrackIndex === undefined) return await TrackPlayer.setQueue(tracks);
    // if currentTrack is not in tracks, its a simple setQueue
    const currentQueue = await TrackPlayer.getQueue();
    const currentTrack = currentQueue[currentTrackIndex];
    const currentTrackNewIndex = tracks.findIndex(
        // define conditions to find the currentTrack in tracks
        track =>
            track.bilisoundId === currentTrack.bilisoundId && track.bilisoundEpisode === currentTrack.bilisoundEpisode,
    );
    log.debug(
        `setQueueUninterrupted: currentTrackIndex is present? ${JSON.stringify({ currentTrackNewIndex, tracks, currentTrack })}`,
    );
    if (currentTrackNewIndex < 0) return TrackPlayer.setQueue(tracks);
    if (forRestore) {
        // todo
    } else {
        // else, splice that all others are removed, new track list spliced
        // that the currentTrack becomes the first element.
        const removeTrackIndices = [...Array(currentQueue.length).keys()];
        removeTrackIndices.splice(currentTrackIndex, 1);
        await TrackPlayer.remove(removeTrackIndices);
        const splicedTracks = tracks.slice(currentTrackNewIndex + 1).concat(tracks.slice(0, currentTrackNewIndex));
        log.debug(`edited tracks ${JSON.stringify({ splicedTracks })}`);
        await TrackPlayer.add(splicedTracks);
    }
}
