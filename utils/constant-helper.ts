import { Platform } from "react-native";

import { BILISOUND_API_PREFIX } from "~/constants/network";

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
    return url;
}
