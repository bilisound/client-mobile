import { BILISOUND_API_PREFIX } from "~/constants/network";

export function getOnlineUrl(bvid: any, episode: any) {
    return BILISOUND_API_PREFIX + `/internal/resource?id=${bvid}&episode=${episode}`;
}
