import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import TrackPlayer, { AddTrack, Track } from "react-native-track-player";
import { v4 as uuidv4 } from "uuid";

import { getCacheAudioPath } from "./file";
import log from "./logger";
import { runTasksLimit } from "./promise";
import { convertToHTTPS } from "./string";

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
            e.url = getCacheAudioPath(e.bilisoundId, e.bilisoundEpisode);
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
                const found = await FileSystem.getInfoAsync(url);
                if (found.exists) {
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

/**
 * 切换播放模式
 */
export async function setMode(): Promise<QueuePlayingMode> {
    const mode = queueStorage.getString(QUEUE_PLAYING_MODE) as QueuePlayingMode | undefined;

    switch (mode) {
        case "shuffle": {
            const { tracks } = await loadTrackData(true);
            await restoreQueue(tracks);
            queueStorage.set(QUEUE_PLAYING_MODE, "normal");
            queueStorage.set(QUEUE_IS_RANDOMIZED, false);
            return "normal";
        }
        case "normal":
        default: {
            await shuffleQueue();
            queueStorage.set(QUEUE_PLAYING_MODE, "shuffle");
            queueStorage.set(QUEUE_IS_RANDOMIZED, true);
            return "shuffle";
        }
    }
}

/**
 * Generates two arrays of indices before and after a given index in an array.
 * @param {number} length The length of the original array
 * @param {number} index The index to split at
 * @returns A tuple containing two arrays of indices
 */
function generateIndicesArrays(length: number, index: number) {
    if (index < 0 || index >= length) {
        throw new Error("Index out of bounds");
    }

    const beforeIndices = Array.from({ length: index }, (_, i) => i);
    const afterIndices = Array.from({ length: length - index - 1 }, (_, i) => i + index + 1);

    return [beforeIndices, afterIndices];
}

/**
 * Splits an array into two parts based on a given index.
 * @template T The type of elements in the array
 * @param {T[]} array The input array
 * @param {number} index The index to split at
 * @returns {[T[], T[]]} A tuple containing two arrays: elements before the index and elements after the index
 */
function splitArrayAtIndex<T>(array: T[], index: number): [T[], T[]] {
    if (index < 0 || index >= array.length) {
        throw new Error("Index out of bounds");
    }

    const beforeElements = array.slice(0, index);
    const afterElements = array.slice(index + 1);

    return [beforeElements, afterElements];
}

/**
 * 原地打乱数组（Fisher-Yates Shuffle 算法）
 * @param array
 */
function shuffleInPlace<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 修改自 https://github.com/doublesymmetry/react-native-track-player/issues/1711#issuecomment-1529325813
/**
 * shuffles the current Queue. The method returns a pre-shuffled Queue,
 * to revert shuffling, use setQueueUninterrupted().
 */
export async function shuffleQueue() {
    const currentQueue = await TrackPlayer.getQueue();
    const tracks = currentQueue.concat();
    shuffleInPlace(tracks);

    // if no currentTrack, its a simple setQueue
    const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
    log.debug(`setQueueUninterrupted: currentTrackIndex is valid? ${JSON.stringify({ currentTrackIndex })}`);
    if (currentTrackIndex === undefined) {
        return TrackPlayer.setQueue(tracks);
    }

    // if currentTrack is not in tracks, its a simple setQueue
    const currentTrack = currentQueue[currentTrackIndex];
    const currentTrackNewIndex = tracks.findIndex(
        // define conditions to find the currentTrack in tracks
        track =>
            track.bilisoundId === currentTrack.bilisoundId && track.bilisoundEpisode === currentTrack.bilisoundEpisode,
    );
    log.debug(
        `setQueueUninterrupted: currentTrackIndex is present? ${JSON.stringify({ currentTrackNewIndex, tracks, currentTrack })}`,
    );

    if (currentTrackNewIndex < 0) {
        return TrackPlayer.setQueue(tracks);
    }

    // else, splice that all others are removed, new track list spliced
    // that the currentTrack becomes the first element.
    const removeTrackIndices = [...Array(currentQueue.length).keys()];
    removeTrackIndices.splice(currentTrackIndex, 1);
    await TrackPlayer.remove(removeTrackIndices);
    const splicedTracks = tracks.slice(currentTrackNewIndex + 1).concat(tracks.slice(0, currentTrackNewIndex));

    // log.debug(`edited tracks ${JSON.stringify({ splicedTracks })}`);
    await TrackPlayer.add(splicedTracks);
    return currentQueue;
}

/**
 * Restores the queue to its original state before shuffling.
 * @param originalTracks The original, unshuffled list of tracks
 */
export async function restoreQueue(originalTracks: Track[]): Promise<void> {
    const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
    if (currentTrackIndex === undefined) {
        // If no track is currently playing, simply set the queue to the original tracks
        return TrackPlayer.setQueue(originalTracks);
    }

    const currentQueue = await TrackPlayer.getQueue();
    const currentTrack = currentQueue[currentTrackIndex];

    // Find the index of the current track in the original list
    const originalIndex = originalTracks.findIndex(
        track =>
            track.bilisoundId === currentTrack.bilisoundId && track.bilisoundEpisode === currentTrack.bilisoundEpisode,
    );

    if (originalIndex < 0) {
        // If the current track is not in the original list, just set the queue to the original tracks
        return TrackPlayer.setQueue(originalTracks);
    }

    const [removeLeft, removeRight] = generateIndicesArrays(currentQueue.length, currentTrackIndex);

    // 移除当前播放的曲目后面的所有曲目
    await TrackPlayer.remove(removeRight);

    // 移除当前播放的曲目前面的所有曲目
    await TrackPlayer.remove(removeLeft);

    const [insertLeft, insertRight] = splitArrayAtIndex(originalTracks, originalIndex);

    // 在前面插入新列表的曲目
    await TrackPlayer.add(insertLeft, 0);

    // 在后面插入新列表的曲目
    await TrackPlayer.add(insertRight);
}
