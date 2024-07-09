import ExpiryMap from "expiry-map";

import { UserInfo, UserSeasonInfo, WebPlayInfo } from "~/api/external/types";
import { USER_AGENT_BILIBILI } from "~/constants/network";
import log from "~/utils/logger";
import { signParam } from "~/utils/wbi";

const map = new ExpiryMap(1200 * 1000, []);

// todo 将 fetch 进行封装以解决重复代码问题

export async function getVideoUrlFestival(
    referer: string,
    avid: string | number,
    bvid: string,
    cid: string | number,
): Promise<WebPlayInfo> {
    const key = `getVideoUrlFestival_${referer}_${avid}_${bvid}_${cid}`;
    if (map.has(key)) {
        return map.get(key);
    }
    const encodedParams = await signParam({
        avid,
        bvid,
        cid,
        from_client: "BROWSER",
    });
    const url = `https://api.bilibili.com/x/player/wbi/playurl?${encodedParams}`;

    log.debug(`请求外部 JSON API: ${url}`);
    const raw = await fetch(url, {
        headers: {
            referer,
            "user-agent": USER_AGENT_BILIBILI,
        },
    });
    const response: WebPlayInfo = await raw.json();
    map.set(key, response);
    return response;
}

export async function getUserSeason(userId: string | number, seasonId: string | number, pageNum = 1) {
    const key = `getUserSeason_${userId}_${seasonId}_${pageNum}`;
    if (map.has(key)) {
        return map.get(key);
    }
    const encodedParams = await signParam({
        mid: userId,
        season_id: seasonId,
        sort_reverse: false,
        page_num: pageNum,
        page_size: 30,
        web_location: 333.999,
    });
    const url = `https://api.bilibili.com/x/polymer/web-space/seasons_archives_list?${encodedParams}`;

    log.debug(`请求外部 JSON API: ${url}`);
    const raw = await fetch(url, {
        headers: {
            referer: `https://space.bilibili.com/${userId}/channel/collectiondetail?sid=${seasonId}`,
            "user-agent": USER_AGENT_BILIBILI,
        },
    });
    const response: UserSeasonInfo = await raw.json();
    map.set(key, response);
    return response;
}

export async function getUserInfo(userId: string | number) {
    const key = `getUserInfo_${arguments}`;
    if (map.has(key)) {
        return map.get(key);
    }
    const encodedParams = await signParam({
        mid: userId,
    });
    const url = `https://api.bilibili.com/x/space/wbi/acc/info?${encodedParams}`;

    log.debug(`请求外部 JSON API: ${url}`);
    const raw = await fetch(url, {
        headers: {
            referer: `https://space.bilibili.com/${userId}`,
            "user-agent": USER_AGENT_BILIBILI,
        },
    });

    const response: UserInfo = await raw.json();
    map.set(key, response);
    return response;
}
