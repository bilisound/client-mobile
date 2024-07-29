import { defineWrap } from "./common";

import { BILIBILI_VIDEO_URL_PREFIX, BILISOUND_API_PREFIX, USER_AGENT_BILISOUND } from "~/constants/network";
import { PlaylistDetailRow } from "~/storage/playlist";
import { Numberish } from "~/typings/common";

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
    const res = await fetch(
        `${BILISOUND_API_PREFIX}/internal/user-list?mode=${mode}&userId=${userId}&listId=${listId}&page=${page}`,
    );
    return (await res.json()).data;
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
