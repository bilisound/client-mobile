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
import { getOnlineUrl } from "~/utils/constant-helper";
import { USER_AGENT_BILIBILI } from "~/constants/network";
import { handleLegacyQueue } from "~/utils/migration/legacy-queue";
import { getCacheAudioPath } from "~/utils/file";

export interface TrackDataOld {
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

export async function saveTrackData() {
    await Promise.all([
        (async () => {
            const tracks = await Player.getTracks();
            queueStorage.set(QUEUE_LIST_VERSION, 2);
            queueStorage.set(
                QUEUE_LIST,
                JSON.stringify(tracks, (key, value) => {
                    if (key === "uri" || key === "headers") {
                        return undefined;
                    }
                    return value;
                }),
            );
            if (!queueStorage.getBoolean(QUEUE_IS_RANDOMIZED)) {
                queueStorage.set(
                    QUEUE_LIST_BACKUP,
                    JSON.stringify(tracks, (key, value) => {
                        if (key === "uri" || key === "headers") {
                            return undefined;
                        }
                        return value;
                    }),
                );
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
                artworkUri: e.artwork,
                title: e.title,
                artist: e.artist,
                duration: e.duration,
                extendedData: {
                    id: e.bilisoundId,
                    episode: e.bilisoundEpisode,
                    isLoaded: e.bilisoundIsLoaded,
                },
            }));
            break;
        }
    }

    trackData.forEach(e => {
        e.headers = {
            referer: getOnlineUrl(e.extendedData.id, e.extendedData.episode),
            "user-agent": USER_AGENT_BILIBILI,
        };
        if (e.extendedData.isLoaded) {
            e.uri = getCacheAudioPath(e.extendedData.id, e.extendedData.episode);
        } else {
            e.uri = require("../assets/placeholder.mp3");
        }
    });

    await Player.addTracks(trackData);
    await Player.jump(current);
}
