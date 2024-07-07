import { UserSeasonInfo, WebPlayInfo } from "~/api/external/types";
import { USER_AGENT_BILIBILI } from "~/constants/network";
import log from "~/utils/logger";
import { signParam } from "~/utils/wbi";

export async function getVideoUrlFestival(referer: string, avid: string | number, bvid: string, cid: string | number) {
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
    return response;
}

export async function getUserSeason(userId: string | number, seasonId: string | number, pageNum = 1) {
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
    return response;
}
