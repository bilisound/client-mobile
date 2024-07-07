import { getVideoUrlFestival } from "~/api/external/json";
import { InitialStateFestivalResponse, InitialStateResponse, WebPlayInfo } from "~/api/external/types";
import { BILIBILI_VIDEO_URL_PREFIX, USER_AGENT_BILIBILI } from "~/constants/network";
import log from "~/utils/logger";
import { extractJSON } from "~/utils/string";
import ExpiringMap from "~/utils/timeout-map";
import { encWbi, getWbiKeys } from "~/utils/wbi";

export interface GetVideoResponse {
    type: "regular";
    initialState: InitialStateResponse;
    playInfo: WebPlayInfo;
}

export interface GetVideoFestivalResponse {
    type: "festival";
    initialState: InitialStateFestivalResponse;
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

export async function getVideo({
    id,
    episode = 1,
    url,
}: GetVideoOptions): Promise<GetVideoResponse | GetVideoFestivalResponse> {
    let key = `${id}__${episode}`;
    const got = videoMap.get(key);
    if (got && id && episode) {
        return got;
    }
    const raw = await fetch(url || `${BILIBILI_VIDEO_URL_PREFIX}${id}/?p=${episode}`, {
        headers: {
            "user-agent": USER_AGENT_BILIBILI,
        },
    });
    const response = await raw.text();

    log.debug(`最终跳转结果：${raw.url}`);
    if (raw.url.startsWith("https://www.bilibili.com/festival/")) {
        log.debug(`按照活动视频处理该查询`);
        // 提取视频播放信息
        const initialState: InitialStateFestivalResponse = extractJSON(
            /window\.__INITIAL_STATE__=(\{.+});\(function\(\)\{/,
            response,
        );
        // 提取视频流信息
        const playInfo = await getVideoUrlFestival(
            raw.url,
            initialState.videoInfo.aid,
            initialState.videoInfo.bvid,
            initialState.videoInfo.pages[0].cid,
        );

        // todo 处理没有音频流的情况
        return { type: "festival", initialState, playInfo };
    } else {
        // 提取视频播放信息
        log.debug(`按照常规视频处理该查询`);
        const initialState: InitialStateResponse = extractJSON(/window\.__INITIAL_STATE__=(\{.+});/, response);
        const playInfo: WebPlayInfo = extractJSON(/window\.__playinfo__=(\{.+})<\/script><script>/, response);
        const getVideoResponse: GetVideoResponse = { type: "regular", initialState, playInfo };

        if (url) {
            key = `${initialState.bvid}__1`;
        }
        videoMap.set(key, getVideoResponse);
        return getVideoResponse;
    }
}
