import { InitialStateFestivalResponse, InitialStateResponse, WebPlayInfo } from "~/api/external/types";
import { BILIBILI_VIDEO_URL_PREFIX, USER_AGENT_BILIBILI } from "~/constants/network";
import log from "~/utils/logger";
import { extractJSON } from "~/utils/string";
import ExpiringMap from "~/utils/timeout-map";

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

export async function getVideo({ id, episode = 1, url }: GetVideoOptions) {
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
        // todo festival video 处理
        // 提取视频播放信息
        const initialState: InitialStateFestivalResponse = extractJSON(
            /window\.__INITIAL_STATE__=(\{.+});\(function\(\)\{/,
            response,
        );
        log.debug(`initialState.videoInfo: ${JSON.stringify(initialState.videoInfo)}`);
        throw new Error(process.env.NODE_ENV === "development" ? "工事中" : "不支持的视频类型");
    } else {
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
}

export async function getVideoUrlFestival() {
    await fetch("https://api.bilibili.com/x/player/wbi/playurl");
}
