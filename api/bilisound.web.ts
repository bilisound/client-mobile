import { defineWrap } from "./common";
import { getVideo } from "./external/direct";

import { getUserInfo, getUserSeason, getUserSeries, getUserSeriesMeta } from "~/api/external/json";
import {
    BILIBILI_GOOD_CDN_REGEX,
    BILIBILI_VIDEO_URL_PREFIX,
    BILISOUND_API_PREFIX,
    USER_AGENT_BILIBILI,
    USER_AGENT_BILISOUND,
} from "~/constants/network";
import { PlaylistDetailRow } from "~/storage/playlist";
import { Numberish } from "~/typings/common";
import log from "~/utils/logger";

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
    seasonId?: number;
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
    const response = await fetch(BILISOUND_API_PREFIX + `/internal/resolve-b23?id=${id}`);
    const json = await response.json();
    return json.data;
}

/**
 * 获取视频元数据
 * @param data
 */
export async function getBilisoundMetadata(data: { id: string }) {
    const response = await fetch(BILISOUND_API_PREFIX + `/internal/metadata?id=${data.id}`);
    return response.json();
}

export interface GetBilisoundResourceUrlOptions {
    id: string;
    episode: number | string;
    filterResourceURL?: boolean;
}

/**
 * 获取音频资源 URL
 * @param data
 */
export async function getBilisoundResourceUrl() {}

export interface EpisodeItem {
    bvid: string;
    title: string;
    cover: string;
    duration: number;
}

export interface GetEpisodeUserResponse {
    pageSize: number;
    pageNum: number;
    total: number;
    rows: EpisodeItem[];
    meta: {
        name: string;
        description: string;
        cover: string;
        userId: Numberish;
        seasonId: Numberish;
    };
}

export type UserListMode = "episode" | "series";

export async function getUserList(mode: UserListMode, userId: Numberish, listId: Numberish, page = 1) {
    let response;
    let pageSize;
    let pageNum;
    let total;
    let name = "";
    let description = "";
    let cover = "";
    if (mode === "episode") {
        response = await getUserSeason(userId, listId, page);
        const data = response.data;
        pageSize = data.page.page_size;
        pageNum = data.page.page_num;
        total = data.page.total;
        name = data.meta.name;
        description = data.meta.description;
        cover = data.meta.cover;
    } else {
        response = await getUserSeries(userId, listId, page);
        const meta = await getUserSeriesMeta(listId);
        pageSize = response.data.page.size;
        pageNum = response.data.page.num;
        total = response.data.page.total;
        name = meta.data.meta.name;
        description = meta.data.meta.description;
        cover = response.data.archives[0].pic;
    }
    const rows = response.data.archives.map(e => ({
        bvid: e.bvid,
        title: e.title,
        cover: e.pic,
        duration: e.duration,
    }));
    return {
        pageSize,
        pageNum,
        total,
        rows,
        meta: {
            name,
            description,
            cover,
            userId,
            seasonId: listId,
        },
    };
}

export async function getUserListFull(
    mode: UserListMode,
    userId: Numberish,
    listId: Numberish,
): Promise<EpisodeItem[]> {
    const firstResponse = await getUserList(mode, userId, listId, 1);
    let results: EpisodeItem[] = firstResponse.rows;
    if (firstResponse.total <= firstResponse.pageSize) {
        return results;
    }
    for (let i = 1; i < Math.ceil(firstResponse.total / firstResponse.pageSize); i++) {
        const newResults = (await getUserList(mode, userId, listId, i + 1)).rows;
        results = results.concat(newResults);
    }
    return results;
}

export async function getUser(userId: Numberish) {
    const response = await getUserInfo(userId);
    return {
        name: response.data.name,
        avatar: response.data.face,
    };
}

/**
 * 获取视频的 Web 页面地址
 * @param id
 * @param episode
 */
export function getVideoUrl(id: string, episode: Numberish) {
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
