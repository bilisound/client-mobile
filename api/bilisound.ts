import { defineWrap } from "./common";
import { getVideo } from "./external/direct";
import log from "../utils/logger";

import { getUserSeason } from "~/api/external/json";
import { UserSeasonInfo } from "~/api/external/types";
import { BILIBILI_GOOD_CDN_REGEX, BILIBILI_VIDEO_URL_PREFIX, USER_AGENT_BILISOUND } from "~/constants/network";
import { PlaylistDetailRow } from "~/storage/playlist";

export type GetBilisoundMetadataResponse = {
    bvid: string;
    aid: number;
    title: string;
    pic: string;
    pubDate: number;
    desc: string;
    owner: {
        mid: number;
        name: string;
        face: string;
    };
    pages: {
        page: number;
        part: string;
        duration: number;
    }[];
};

function filterHostname(list: string[]) {
    return list.map(e => {
        try {
            const { hostname } = new URL(e);
            return hostname;
        } catch (er) {
            // 日志用的工具函数，错误在这里不重要
            return e;
        }
    });
}

/**
 * 解析短链接
 */
export async function parseB23(id: string) {
    // 注意：解析重定向结果的方案在 React Native 不可用
    // 详见 https://reactnative.dev/docs/network#known-issues-with-fetch-and-cookie-based-authentication
    const res = await getVideo({ url: `https://b23.tv/${id}` });
    return res.type === "regular" ? res.initialState.bvid : res.initialState.videoInfo.bvid;
}

/**
 * 获取视频元数据
 * @param data
 */
export async function getBilisoundMetadata(data: { id: string }) {
    const { id } = data;
    // 获取视频网页
    const { initialState, type } = await getVideo({ id, episode: 1 });

    // 提取视频信息
    switch (type) {
        case "regular": {
            const videoData = initialState?.videoData;
            const pages = videoData?.pages ?? [];
            if (!videoData || pages.length <= 0) {
                log.error("找不到视频信息（在常规页面没有视频信息）");
                throw new Error("找不到视频信息");
            }
            if (videoData.is_upower_exclusive) {
                log.error("不支持的视频类型：充电视频");
                throw new Error("不支持的视频类型");
            }

            // 没有分 P 的视频，将第一个视频的标题替换成投稿标题
            if (pages.length === 1) {
                pages[0].part = videoData.title;
            }

            return defineWrap<GetBilisoundMetadataResponse>({
                code: 200,
                data: {
                    bvid: videoData.bvid,
                    aid: videoData.aid,
                    title: videoData.title,
                    pic: videoData.pic,
                    owner: videoData.owner,
                    desc: (videoData?.desc_v2 ?? []).map(e => e.raw_text).join("\n"),
                    pubDate: videoData.pubdate * 1000,
                    pages: pages.map(({ page, part, duration }) => ({ page, part, duration })),
                },
                msg: "",
            });
        }
        case "festival": {
            const videoInfo = initialState?.videoInfo;
            const pages = videoInfo?.pages ?? [];
            if (!videoInfo || pages.length <= 0) {
                log.error("找不到视频信息（在活动页面没有视频信息）");
                throw new Error("找不到视频信息");
            }
            // 没有分 P 的视频，将第一个视频的标题替换成投稿标题
            if (pages.length === 1) {
                pages[0].part = videoInfo.title;
            }
            const found = initialState.sectionEpisodes.find(e => e.bvid === videoInfo.bvid);
            if (!found) {
                log.error("找不到视频信息（在活动页面的合集列表找不到当前播放的视频）");
                throw new Error("找不到视频信息");
            }
            return defineWrap<GetBilisoundMetadataResponse>({
                code: 200,
                data: {
                    bvid: videoInfo.bvid,
                    aid: videoInfo.aid,
                    title: videoInfo.title,
                    pic: found.cover,
                    owner: found.author,
                    desc: videoInfo.desc,
                    pubDate: videoInfo.pubdate * 1000,
                    pages: pages.map(({ page, part, duration }) => ({ page, part, duration })),
                },
                msg: "",
            });
        }
        default:
            throw new Error("未实现的视频类型！！");
    }
}

/**
 * 获取音频资源 URL
 * @param data
 */
export async function getBilisoundResourceUrl(data: {
    id: string;
    episode: number | string;
    filterResourceURL?: boolean;
}): Promise<{ url: string; isAudio: boolean }> {
    const { id, episode } = data;

    // 获取视频
    const { playInfo } = await getVideo({ id, episode });
    const dashAudio = playInfo?.data?.dash?.audio;
    const legacyVideo = playInfo?.data?.durl;

    // [dash] 遍历获取最佳音质视频
    if (Array.isArray(dashAudio) && dashAudio.length > 0) {
        let maxQualityIndex = 0;
        dashAudio.forEach((value, index, array) => {
            if (array[maxQualityIndex].codecid < maxQualityIndex) {
                maxQualityIndex = index;
            }
        });

        const { baseUrl, backupUrl } = dashAudio[maxQualityIndex];
        const urlList = [baseUrl];
        if (Array.isArray(backupUrl)) {
            urlList.push(...backupUrl);
        }

        if (!data.filterResourceURL) {
            log.debug(`没有进行过滤。来源域名列表: ${filterHostname(urlList).join(", ")}`);
            return { url: urlList[0], isAudio: true };
        }

        const newUrlList = urlList.filter(e => {
            for (let i = 0; i < BILIBILI_GOOD_CDN_REGEX.length; i++) {
                const f = BILIBILI_GOOD_CDN_REGEX[i];
                if (f.test(new URL(e).hostname)) {
                    return true;
                }
            }
            return false;
        });
        if (newUrlList.length <= 0) {
            log.warn(
                `过滤失败，因此使用原始地址列表中的第一项。来源域名列表: ${filterHostname(newUrlList).join(", ")}`,
            );
            return { url: newUrlList[0], isAudio: true };
        }
        log.debug(`过滤成功！来源域名列表: ${filterHostname(newUrlList).join(", ")}`);
        return { url: newUrlList[0], isAudio: true };
    }

    // [legacy/durl] 遍历获取最佳音质视频
    if (Array.isArray(legacyVideo) && legacyVideo.length > 0) {
        const videoItem = legacyVideo[0];
        const urlList = [videoItem.url, ...videoItem.backup_url];
        if (!data.filterResourceURL) {
            log.debug(`没有进行过滤。来源域名列表: ${filterHostname(urlList).join(", ")}`);
            return { url: urlList[0], isAudio: false };
        }
        const newUrlList = urlList.filter(e => {
            for (let i = 0; i < BILIBILI_GOOD_CDN_REGEX.length; i++) {
                const f = BILIBILI_GOOD_CDN_REGEX[i];
                if (f.test(new URL(e).hostname)) {
                    return true;
                }
            }
            return false;
        });

        if (newUrlList.length <= 0) {
            log.warn(
                `过滤失败，因此使用原始地址列表中的第一项。来源域名列表: ${filterHostname(newUrlList).join(", ")}`,
            );
            return { url: newUrlList[0], isAudio: false };
        }
        log.debug(`过滤成功！来源域名列表: ${filterHostname(newUrlList).join(", ")}`);
        return { url: newUrlList[0], isAudio: false };
    }

    throw new Error("找不到视频流资源");
}

export interface GetEpisodeUserResponse {
    pageSize: number;
    pageNum: number;
    total: number;
    rows: {
        bvid: string;
        title: string;
        cover: string;
        duration: number;
    }[];
    meta: UserSeasonInfo["data"]["meta"];
}

export async function getEpisodeUser(userId: string | number, seasonId: string | number, pageNum = 1) {
    const response = await getUserSeason(userId, seasonId, pageNum);
    const rows = response.data.archives.map(e => ({
        bvid: e.bvid,
        title: e.title,
        cover: e.pic,
        duration: e.duration,
    }));
    return {
        pageSize: response.data.page.page_size,
        pageNum: response.data.page.page_num,
        total: response.data.page.total,
        rows,
        meta: response.data.meta,
    };
}

/**
 * 获取视频的 Web 页面地址
 * @param id
 * @param episode
 */
export function getVideoUrl(id: string, episode: string | number) {
    return `${BILIBILI_VIDEO_URL_PREFIX}${id}/?p=${episode}`;
}

/**
 * 获取 PC 端歌单转移数据
 * @param id
 */
export async function getTransferList(id: string) {
    const response = await fetch(`https://bilisound.tuu.run/api/internal/transfer-list/${id}`, {
        headers: {
            "user-agent": USER_AGENT_BILISOUND,
        },
    });
    return defineWrap<PlaylistDetailRow[] | null>(await response.json());
}
