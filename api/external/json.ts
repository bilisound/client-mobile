import promiseMemoize from "promise-memoize";

import { biliRequest } from "~/api/external/request";
import { UserInfo, UserSeasonInfo, WebPlayInfo } from "~/api/external/types";

const maxAge = 600_000;

export const getVideoUrlFestival = promiseMemoize(
    async (referer: string, avid: string | number, bvid: string, cid: string | number) => {
        return biliRequest<WebPlayInfo>({
            url: "/x/player/wbi/playurl",
            params: {
                avid,
                bvid,
                cid,
            },
            headers: {
                referer,
            },
        });
    },
    { maxAge },
);

export const getUserSeason = promiseMemoize(
    (userId: string | number, seasonId: string | number, pageNum = 1) => {
        return biliRequest<UserSeasonInfo>({
            url: "/x/polymer/web-space/seasons_archives_list",
            params: {
                mid: userId,
                season_id: seasonId,
                sort_reverse: false,
                page_num: pageNum,
                page_size: 30,
            },
            headers: {
                referer: `https://space.bilibili.com/${userId}/channel/collectiondetail?sid=${seasonId}`,
            },
        });
    },
    { maxAge },
);

export const getUserInfo = promiseMemoize(
    async (userId: string | number) => {
        return biliRequest<UserInfo>({
            url: "/x/space/wbi/acc/info",
            params: {
                mid: userId,
            },
            headers: {
                referer: `https://space.bilibili.com/${userId}/video`,
            },
        });
    },
    { maxAge },
);
