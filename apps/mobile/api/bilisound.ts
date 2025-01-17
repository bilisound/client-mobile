import { Platform } from "react-native";

import { defineWrap } from "./common";
import { getVideo } from "./external/direct";

import { getUserSeason, getUserSeries, getUserSeriesMeta } from "~/api/external/json";
import { BILISOUND_API_PREFIX, USER_AGENT_BILIBILI, USER_AGENT_BILISOUND } from "~/constants/network";
import { PlaylistDetail } from "~/storage/sqlite/schema";
import { Numberish } from "~/typings/common";
import log from "~/utils/logger";
import { BilisoundSDK, GetMetadataResponse } from "@bilisound/sdk";

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

const sdk = new BilisoundSDK({
    userAgent: USER_AGENT_BILIBILI,
    apiPrefix: BILISOUND_API_PREFIX,
});

/**
 * 解析短链接
 */
export async function parseB23(id: string) {
    if (Platform.OS === "web") {
        const response = await fetch(BILISOUND_API_PREFIX + `/internal/resolve-b23?id=${id}`);
        const json = await response.json();
        return json.data;
    }

    return sdk.parseB23(id);
}

/**
 * 获取视频元数据
 * @param data
 */
export async function getBilisoundMetadata(data: { id: string }): Promise<GetMetadataResponse> {
    if (Platform.OS === "web") {
        const response = await fetch(BILISOUND_API_PREFIX + `/internal/metadata?id=${data.id}`);
        const outData = await response.json();
        if (outData.code !== 200) {
            throw new Error(outData.msg);
        }
        return outData.data;
    }

    return sdk.getMetadata(data.id);
}

/**
 * 获取音频资源 URL
 * @param id
 * @param episode
 * @param filterResourceURL
 */
export async function getBilisoundResourceUrl(id: string, episode: number | string, filterResourceURL = false) {
    if (Platform.OS === "web") {
        return {
            url: BILISOUND_API_PREFIX + `/internal/resource?id=${id}&episode=${episode}`,
            isAudio: true,
        };
    }

    return sdk.getResourceUrl(id, episode, filterResourceURL);
}

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

export type UserListMode = "season" | "series" | "favourite";

/**
 * 尝试一次性获取完整合集列表
 * @param userId
 * @param listId
 */
async function tryGetFullSection(userId: Numberish, listId: Numberish): Promise<GetEpisodeUserResponse | null> {
    log.info("尝试一次获取完整合集");
    log.debug(`userId: ${userId}, listId: ${listId}`);

    const { data } = await getUserSeason(userId, listId, 1);
    if (data.page.total <= data.page.page_size) {
        log.warn("一次获取完整合集取消：视频总数小于单页展示数量，无需进行此操作");
        return null;
    }

    const name = data.meta.name;
    const description = data.meta.description;
    const cover = data.meta.cover;
    const firstVideoId = data.archives[0]?.bvid;
    if (!firstVideoId) {
        log.warn("一次获取完整合集失败：列表中没有找到第一个视频 ID");
        return null;
    }

    const firstVideoResponse = await getVideo({ id: firstVideoId });
    if (firstVideoResponse.type !== "regular") {
        log.warn("一次获取完整合集失败：非常规视频");
        return null;
    }

    const sections = firstVideoResponse.initialState.sectionsInfo?.sections ?? [];
    const episodes = sections.flatMap(section => section.episodes ?? []);
    if (episodes.length <= 0) {
        log.warn("一次获取完整合集失败：列表中没有找到视频");
        return null;
    }

    const rows = episodes.map(e => ({
        bvid: e.bvid,
        title: e.title,
        cover: e.arc.pic,
        duration: e.arc.duration,
    }));

    log.debug(`一次获取完整合集成功：${rows.length} 条记录`);
    return {
        pageSize: rows.length,
        pageNum: 1,
        total: rows.length,
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

/**
 * 获取用户列表（合集/列表）
 * @param mode
 * @param userId
 * @param listId
 * @param page
 */
export async function getUserList(
    mode: UserListMode,
    userId: Numberish,
    listId: Numberish,
    page = 1,
): Promise<GetEpisodeUserResponse> {
    if (Platform.OS === "web") {
        const res = await fetch(
            `${BILISOUND_API_PREFIX}/internal/user-list?mode=${mode}&userId=${userId}&listId=${listId}&page=${page}`,
        );
        return (await res.json()).data;
    }

    let response;
    let pageSize;
    let pageNum;
    let total;
    let name = "";
    let description = "";
    let cover = "";
    if (mode === "season") {
        // 首先尝试从任意一个视频详情页面抓取完整的合集列表
        const fullResult = await tryGetFullSection(userId, listId);
        if (fullResult) {
            return fullResult;
        }

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

/**
 * 一次性拉取完整用户列表（合集/列表）
 * @param mode
 * @param userId
 * @param listId
 * @param progressCallback
 */
export async function getUserListFull(
    mode: UserListMode,
    userId: Numberish,
    listId: Numberish,
    progressCallback?: (progress: number) => void,
): Promise<EpisodeItem[]> {
    progressCallback?.(0);
    const firstResponse = await getUserList(mode, userId, listId, 1);
    const totalPages = Math.ceil(firstResponse.total / firstResponse.pageSize);
    progressCallback?.(1 / totalPages);
    let results: EpisodeItem[] = firstResponse.rows;
    if (firstResponse.total <= firstResponse.pageSize) {
        return results;
    }
    for (let i = 1; i < totalPages; i++) {
        const newResults = (await getUserList(mode, userId, listId, i + 1)).rows;
        progressCallback?.((i + 1) / totalPages);
        results = results.concat(newResults);
    }
    return results;
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
    return defineWrap<PlaylistDetail[] | null>(await response.json());
}
