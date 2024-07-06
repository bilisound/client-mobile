import ExpiringMap from "../utils/timeout-map";

import { BILIBILI_VIDEO_URL_PREFIX, USER_AGENT_BILIBILI } from "~/constants/network";
import { InitialStateResponse, WebPlayInfo } from "~/types";
import { extractJSON } from "~/utils/string";

export interface GetVideoResponse {
    initialState: InitialStateResponse;
    playInfo: WebPlayInfo;
}

// const defaultExpirationTime = 1;
const defaultExpirationTime = 60 * 60 * 1000;
const videoMap = new ExpiringMap<string, GetVideoResponse>(defaultExpirationTime);

export interface GetVideoOptions {
    id?: string;
    episode?: string | number;
    url?: string;
}

export async function getVideo({ id, episode = 1, url }: GetVideoOptions): Promise<GetVideoResponse> {
    let key = `${id}__${episode}`;
    const got = videoMap.get(key);
    if (got && id && episode) {
        return got;
    }
    const response = await fetch(url || `${BILIBILI_VIDEO_URL_PREFIX}${id}/?p=${episode}`, {
        headers: {
            "user-agent": USER_AGENT_BILIBILI,
        },
    }).then(e => e.text());

    // 提取视频播放信息
    const initialState: InitialStateResponse = extractJSON(/window\.__INITIAL_STATE__=(\{.+});/, response);
    const playInfo: WebPlayInfo = extractJSON(/window\.__playinfo__=(\{.+})<\/script><script>/, response);
    const getVideoResponse: GetVideoResponse = { initialState, playInfo };

    if (url) {
        key = `${initialState.bvid}__1`;
    }
    videoMap.set(key, getVideoResponse);
    return getVideoResponse;
}
