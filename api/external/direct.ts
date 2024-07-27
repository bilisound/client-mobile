import promiseMemoize from "promise-memoize";

import { getVideoUrlFestival } from "~/api/external/json";
import { InitialStateFestivalResponse, InitialStateResponse, WebPlayInfo } from "~/api/external/types";
import { BILIBILI_VIDEO_URL_PREFIX, USER_AGENT_BILIBILI } from "~/constants/network";
import log from "~/utils/logger";
import { extractJSON } from "~/utils/string";

const maxAge = 600_000;

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

export interface GetVideoOptions {
    id?: string;
    episode?: string | number;
    url?: string;
}

export const getVideo = promiseMemoize(
    async ({ id, episode = 1, url }: GetVideoOptions): Promise<GetVideoResponse | GetVideoFestivalResponse> => {
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

            return { type: "festival", initialState, playInfo };
        } else {
            // 提取视频播放信息
            log.debug(`按照常规视频处理该查询`);
            const initialState: InitialStateResponse = extractJSON(/window\.__INITIAL_STATE__=(\{.+});/, response);
            const playInfo: WebPlayInfo = extractJSON(/window\.__playinfo__=(\{.+})<\/script><script>/, response);
            return { type: "regular", initialState, playInfo };
        }
    },
    { maxAge },
);
