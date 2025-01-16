import * as Player from "@bilisound/player";

import {
    QUEUE_CURRENT_INDEX,
    QUEUE_IS_RANDOMIZED,
    QUEUE_LIST,
    QUEUE_LIST_BACKUP,
    QUEUE_LIST_VERSION,
    queueStorage,
} from "~/storage/queue";
import { TrackData } from "@bilisound/player/build/types";
import { getVideoUrl } from "~/utils/constant-helper";
import { USER_AGENT_BILIBILI } from "~/constants/network";
import { handleLegacyQueue } from "~/utils/migration/legacy-queue";
import { getCacheAudioPath } from "~/utils/file";
import { getBilisoundMetadata, getBilisoundResourceUrl } from "~/api/bilisound";
import { undefined } from "zod";
import log from "~/utils/logger";
import { PlaylistDetail } from "~/storage/sqlite/schema";
import { cacheStatusStorage } from "~/storage/cache-status";
import { PLACEHOLDER_AUDIO, URI_EXPIRE_DURATION } from "~/constants/playback";
import { getPlaylistDetail } from "~/storage/sqlite/playlist";
import { Platform } from "react-native";
import { invalidateOnQueueStatus } from "~/storage/playlist";
import { convertToHTTPS } from "~/utils/string";
import useSettingsStore from "~/store/settings";

interface TrackDataOld {
    /** The track title */
    title?: string;
    /** The track album */
    album?: string;
    /** The track artist */
    artist?: string;
    /** The track duration in seconds */
    duration?: number;
    /** The track artwork */
    artwork?: string;
    /** track description */
    description?: string;
    /** The track genre */
    genre?: string;
    /** The track release date in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) */
    date?: string;
    /** The track rating */
    rating?: any;
    /**
     * (iOS only) Whether the track is presented in the control center as being
     * live
     **/
    isLiveStream?: boolean;
    url: string;
    type?: any;
    /** The user agent HTTP header */
    userAgent?: string;
    /** Mime type of the media file */
    contentType?: string;
    /** (iOS only) The pitch algorithm to apply to the sound. */
    pitchAlgorithm?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers?: { [key: string]: any };

    bilisoundId: string;
    bilisoundEpisode: string;
    bilisoundUniqueId: string;
    bilisoundIsLoaded: boolean;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // [key: string]: any;
}

export function playlistToTracks(playlist: PlaylistDetail[]): TrackData[] {
    return playlist.map(e => {
        const isLoaded = !!cacheStatusStorage.getBoolean(e.bvid + "_" + e.episode);

        return {
            uri: isLoaded ? getCacheAudioPath(e.bvid, e.episode, true) : PLACEHOLDER_AUDIO,
            artist: e.author,
            artworkUri: convertToHTTPS(e.imgUrl),
            duration: e.duration,
            extendedData: {
                id: e.bvid,
                episode: e.episode,
                isLoaded,
                expireAt: 0,
            },
            headers: {
                referer: getVideoUrl(e.bvid, e.episode),
                "user-agent": USER_AGENT_BILIBILI,
            },
            id: e.bvid + "_" + e.episode,
            title: e.title,
        };
    });
}

export async function saveTrackData() {
    log.debug("正在自动保存播放队列");
    await Promise.all([
        (async () => {
            const tracks: any[] = await Player.getTracks();
            tracks.forEach(e => {
                delete e.uri;
                delete e.headers;
                delete e.mimeType;
                if (e.extendedData) {
                    delete e.extendedData.expireAt;
                }
            });
            queueStorage.set(QUEUE_LIST_VERSION, 2);
            queueStorage.set(QUEUE_LIST, JSON.stringify(tracks));
            if (!queueStorage.getBoolean(QUEUE_IS_RANDOMIZED)) {
                queueStorage.set(QUEUE_LIST_BACKUP, JSON.stringify(tracks));
            }
        })(),
        (async () => {
            const current = await Player.getCurrentTrackIndex();
            queueStorage.set(QUEUE_CURRENT_INDEX, current || 0);
        })(),
    ]);
}

export async function loadTrackData() {
    const version = queueStorage.getNumber(QUEUE_LIST_VERSION);

    let current = queueStorage.getNumber(QUEUE_CURRENT_INDEX) || 0;
    let trackData: TrackData[];

    switch (version) {
        // 2.x 版本
        case 2: {
            const trackRawData = queueStorage.getString(QUEUE_LIST) || "[]";
            trackData = JSON.parse(trackRawData);
            break;
        }
        // 1.x 版本（可能还有旧版 JSON 数据文件）
        default: {
            const trackRawData = queueStorage.getString(QUEUE_LIST) || "[]";
            let tracks: TrackDataOld[] = JSON.parse(trackRawData);

            const tryMigrate = await handleLegacyQueue();
            if (tryMigrate) {
                tracks = tryMigrate.tracks;
                current = tryMigrate.current;
            }

            trackData = tracks.map(e => ({
                id: e.bilisoundUniqueId,
                uri: "",
                artworkUri: convertToHTTPS(e.artwork ?? ""),
                title: e.title,
                artist: e.artist,
                duration: e.duration,
                extendedData: {
                    id: e.bilisoundId,
                    episode: Number(e.bilisoundEpisode),
                    isLoaded: e.bilisoundIsLoaded,
                    expireAt: 0,
                },
            }));
            break;
        }
    }

    trackData.forEach(e => {
        if (!e.extendedData) {
            return;
        }
        e.headers = {
            referer: getVideoUrl(e.extendedData.id, e.extendedData.episode),
            "user-agent": USER_AGENT_BILIBILI,
        };
        if (e.extendedData.isLoaded) {
            e.uri = getCacheAudioPath(e.extendedData.id, e.extendedData.episode);
            e.mimeType = "video/mp4";
        } else {
            e.uri = PLACEHOLDER_AUDIO;
        }
    });

    // 提前 refreshTrack 是为了缓解 Bilisound 播放器 iOS 版本（？）的一个 Bug：
    // 如果用户退出应用时上次播放的是没有加载过的音频，重新启动应用后会自动跳转到下一首曲目
    trackData[current] = await refreshTrack(trackData[current]);
    await Player.setQueue(trackData, current);
}

export async function addTrackFromDetail(id: string, episode: number) {
    log.debug(`用户请求增加曲目：${id} / ${episode}`);
    const existing = await Player.getTracks();
    const found = existing.findIndex(e => e.extendedData?.id === id && e.extendedData.episode === episode);
    if (found >= 0) {
        log.debug(`发现列表中已有相同曲目 ${found}，进行跳转`);
        await Player.jump(found);
        return;
    }

    const { data } = await getBilisoundMetadata({ id });
    const url = await getBilisoundResourceUrl(id, episode, useSettingsStore.getState().filterResourceURL);
    const currentEpisode = data.pages.find(e => e.page === episode);
    if (!currentEpisode) {
        throw new Error("指定视频没有指定的分 P 信息");
    }

    await Player.addTrack({
        uri: url.url,
        artist: data.owner.name,
        artworkUri: convertToHTTPS(data.pic),
        duration: currentEpisode.duration,
        mimeType: "video/mp4",
        extendedData: {
            id,
            episode,
            isLoaded: false,
            expireAt: new Date().getTime() + URI_EXPIRE_DURATION,
        },
        headers: {
            referer: getVideoUrl(id, episode),
            "user-agent": USER_AGENT_BILIBILI,
        },
        id: id + "_" + episode,
        title: data.pages.length === 1 ? data.title : currentEpisode.part,
    });

    await Player.jump(existing.length); // existing.length - 1 + 1
    await Player.play();
    invalidateOnQueueStatus();
}

export async function refreshTrack(trackData: TrackData) {
    const id = trackData.extendedData!.id;
    const episode = trackData.extendedData!.episode;
    log.info("正在进行刷新 Track 操作");
    log.debug(`id: ${id}, episode: ${episode}`);

    // 处理本地缓存
    const got = cacheStatusStorage.getBoolean(`${id}_${episode}`);
    if (got && trackData.extendedData?.isLoaded) {
        log.info("有缓存，应用缓存");
        // url 设置为缓存数据
        trackData.uri = getCacheAudioPath(id, episode, true);
        trackData.extendedData!.isLoaded = true;
        return trackData;
    }

    // 拉取最新的 URL
    log.info("开始拉取最新的 URL");
    const url = await getBilisoundResourceUrl(id, episode, useSettingsStore.getState().filterResourceURL);
    trackData.uri = url.url;
    trackData.extendedData!.expireAt = new Date().getTime() + URI_EXPIRE_DURATION;
    trackData.mimeType = "video/mp4";
    return trackData;
}

// 预先刷新现在播放的曲目
export async function refreshCurrentTrack() {
    if (Platform.OS === "web") {
        return;
    }
    log.debug("检查当前曲目是否可能需要替换");
    const trackData = await Player.getCurrentTrack();
    const trackIndex = await Player.getCurrentTrackIndex();
    // console.log(JSON.stringify(trackData, null, 4));
    // console.log(trackIndex);
    if (
        trackData &&
        !trackData.extendedData?.isLoaded &&
        (trackData.extendedData?.expireAt ?? 0) <= new Date().getTime()
    ) {
        log.debug("进行曲目替换操作");
        await Player.replaceTrack(trackIndex, await refreshTrack(trackData));
        return;
    }
}

export async function replaceQueueWithPlaylist(id: number, index = 0) {
    const data = await getPlaylistDetail(id);
    const tracks = playlistToTracks(data);
    if (!tracks[index].extendedData?.isLoaded) {
        await refreshTrack(tracks[index]);
    }
    await Player.setQueue(tracks, index);
    await Player.play();
}
