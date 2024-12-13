import { Platform } from "react-native";

import { BILISOUND_API_PREFIX } from "~/constants/network";
import { convertToHTTPS } from "~/utils/string";

export function getVideoUrl(bvid: any, episode: any) {
    return `https://www.bilibili.com/video/${bvid}${episode === 1 || episode === "1" ? "" : `/&p=${episode}`}`;
}

export function getOnlineUrl(bvid: any, episode: any) {
    return BILISOUND_API_PREFIX + `/internal/resource?id=${bvid}&episode=${episode}`;
}

export function getImageProxyUrl(url: string, referer = "https://www.bilibili.com") {
    if (Platform.OS === "web") {
        return (
            BILISOUND_API_PREFIX +
            `/internal/img-proxy?url=${encodeURIComponent(url)}&referrer=${encodeURIComponent(referer)}`
        );
    }
    return convertToHTTPS(url);
}
