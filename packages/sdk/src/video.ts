import { VideoResponse } from "./types";

export async function fetchVideo(id: string, episode: number | string, userAgent: string): Promise<VideoResponse> {
    // 获取视频网页
    const url = id.startsWith("BV") ? `https://www.bilibili.com/video/${id}` : `https://www.bilibili.com/festival/${id}`;
    const pageUrl = typeof episode === "number" ? `${url}?p=${episode}` : url;

    const response = await fetch(pageUrl, {
        headers: {
            "User-Agent": userAgent,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // 提取 initialState
    const initialStateMatch = html.match(/window\.__INITIAL_STATE__=({[^]*?});/);
    if (!initialStateMatch) {
        throw new Error("无法提取视频信息");
    }

    const initialState = JSON.parse(initialStateMatch[1]);

    // 提取 playinfo
    const playInfoMatch = html.match(/window\.__playinfo__=({[^]*?})</);
    if (!playInfoMatch) {
        throw new Error("无法提取播放信息");
    }

    const playInfo = JSON.parse(playInfoMatch[1]);

    // 判断视频类型
    const type = id.startsWith("BV") ? "regular" : "festival";

    return {
        initialState,
        playInfo,
        type,
    };
}
