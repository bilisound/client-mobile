import {
    BILIBILI_GOOD_CDN_REGEX,
    BILIBILI_VIDEO_URL_PREFIX,
    USER_AGENT_BILIBILI,
} from "../constants/network";
import { defineWrap } from "./common";
import { getVideo } from "./bilibili-direct";
import log from "../utils/logger";

export type GetBilisoundMetadataResponse = {
    bvid: string
    aid: number
    title: string
    pic: string
    pubDate: number
    desc: string
    owner: {
        mid: number
        name: string
        face: string
    }
    pages: Array<{
        page: number
        part: string
        duration: number
    }>
};

const USE_TUU_API = false;

function filterHostname(list: string[]) {
    return list.map((e) => {
        try {
            const { hostname } = new URL(e);
            return hostname;
        } catch (er) {
            // 日志用的工具函数，错误在这里不重要
            return e;
        }
    });
}

export async function getBilisoundResolveB23(data: { id: string }) {
    const { id } = data;
    const response = await fetch(`https://b23.tv/${id}`, {
        headers: {
            "user-agent": USER_AGENT_BILIBILI,
        },
        redirect: "manual",
    });

    return defineWrap({
        code: 200,
        data: response.headers.get("location"),
        msg: "",
    });
}

export async function getBilisoundMetadata(data: { id: string }) {
    const { id } = data;
    // 获取视频网页
    const { initialState } = await getVideo(id, 1);

    // 提取视频信息
    const videoData = initialState?.videoData;
    const pages = videoData?.pages ?? [];
    if (!videoData || pages.length <= 0) {
        throw new Error("找不到视频信息");
    }
    if (videoData.is_upower_exclusive) {
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
            desc: (videoData?.desc_v2 ?? []).map((e) => e.raw_text).join("\n"),
            pubDate: videoData.pubdate * 1000,
            pages: pages.map(({ page, part, duration }) => ({ page, part, duration })),
        },
        msg: "",
    });
}

export async function getBilisoundResourceUrl(data: { id: string, episode: number | string, filterResourceURL?: boolean }) {
    const { id, episode } = data;

    if (USE_TUU_API) {
        return `https://bilisound.tuu.run/api/internal/resource?id=${id}&episode=${episode}`;
    }

    // 获取视频
    const { playInfo } = await getVideo(id, episode);
    const dashAudio = playInfo?.data?.dash?.audio;

    if (!Array.isArray(dashAudio) || dashAudio.length <= 0) {
        throw new Error("找不到视频流资源");
    }

    // 遍历获取最佳音质视频
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

    // 理论可行性：无视 B 站推荐的 CDN 节点
    /* const url = new URL(urlList[0]);
    url.hostname = "cn-gdfs-ct-01-13.bilivideo.com";

    return url.toString(); */
    if (!data.filterResourceURL) {
        log.debug(`没有进行过滤。来源域名列表: ${filterHostname(urlList).join(", ")}`);
        return urlList[0];
    }

    const newUrlList = urlList.filter((e) => {
        for (let i = 0; i < BILIBILI_GOOD_CDN_REGEX.length; i++) {
            const f = BILIBILI_GOOD_CDN_REGEX[i];
            if (f.test(new URL(e).hostname)) {
                return true;
            }
        }
        return false;
    });
    if (newUrlList.length <= 0) {
        log.warn(`过滤失败，因此使用原始地址列表中的第一项。来源域名列表: ${filterHostname(newUrlList).join(", ")}`);
        return urlList[0];
    }
    log.debug(`过滤成功！来源域名列表: ${filterHostname(newUrlList).join(", ")}`);
    return newUrlList[0];
}

export function getVideoUrl(id: string, episode: string | number) {
    return `${BILIBILI_VIDEO_URL_PREFIX}${id}/?p=${episode}`;
}
