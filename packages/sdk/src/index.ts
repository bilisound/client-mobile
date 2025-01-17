import { GetMetadataResponse, Logger, SDKOptions, VideoResponse } from "./types";
import { fetchVideo } from "./video";
import { filterCdnUrls } from "./cdn";

export class BilisoundSDK {
    logger: Logger;
    userAgent: string;
    apiPrefix: string;
    platform: string;

    constructor(options: SDKOptions = {}) {
        this.logger = options.logger ?? {
            info: console.info.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console),
        };
        this.userAgent = options.userAgent ?? "";
        this.apiPrefix = options.apiPrefix ?? "";
    }

    private filterHostname(list: string[]): string[] {
        return list.map(e => {
            try {
                const { hostname } = new URL(e);
                return hostname;
            } catch (er) {
                this.logger.warn("URL 解析失败：" + er);
                return e;
            }
        });
    }

    async parseB23(id: string): Promise<string> {
        const res = await fetch(`https://b23.tv/${id}`, {
            headers: {
                "User-Agent": this.userAgent,
            },
        });
        return res.url;
    }

    async getMetadata(id: string): Promise<GetMetadataResponse> {
        if (this.platform === "web") {
            const response = await fetch(this.apiPrefix + `/internal/metadata?id=${id}`);
            const outData = await response.json();
            if (outData.code !== 200) {
                throw new Error(outData.msg);
            }
            return outData.data;
        }

        // 获取视频网页
        const videoData = await this.getVideo(id, 1);
        return this.parseVideoData(videoData);
    }

    private parseVideoData(videoData: VideoResponse): GetMetadataResponse {
        const { initialState, type } = videoData;

        switch (type) {
            case "regular": {
                const data = initialState.videoData;
                const pages = data?.pages ?? [];
                if (!data || pages.length <= 0) {
                    this.logger.error("找不到视频信息（在常规页面没有视频信息）");
                    throw new Error("找不到视频信息");
                }
                if (data.is_upower_exclusive) {
                    this.logger.error("不支持的视频类型：充电视频");
                    throw new Error("不支持的视频类型");
                }

                // 没有分 P 的视频，将第一个视频的标题替换成投稿标题
                if (pages.length === 1 && pages[0].part.trim().length <= 0) {
                    pages[0].part = data.title;
                }

                return {
                    bvid: data.bvid,
                    aid: data.aid,
                    title: data.title,
                    pic: data.pic,
                    owner: data.owner,
                    desc: (data.desc_v2 ?? []).map(e => e.raw_text).join("\n"),
                    pubDate: data.pubdate * 1000,
                    pages: pages.map(({ page, part, duration }) => ({ page, part, duration })),
                    seasonId: data.season_id,
                };
            }
            case "festival": {
                const videoInfo = initialState.videoInfo;
                const pages = videoInfo?.pages ?? [];
                if (!videoInfo || pages.length <= 0) {
                    this.logger.error("找不到视频信息（在活动页面没有视频信息）");
                    throw new Error("找不到视频信息");
                }
                // 没有分 P 的视频，将第一个视频的标题替换成投稿标题
                if (pages.length === 1) {
                    pages[0].part = videoInfo.title;
                }
                const found = initialState.sectionEpisodes?.find(e => e.bvid === videoInfo.bvid);
                if (!found) {
                    this.logger.error("找不到视频信息（在活动页面的合集列表找不到当前播放的视频）");
                    throw new Error("找不到视频信息");
                }
                return {
                    bvid: videoInfo.bvid,
                    aid: videoInfo.aid,
                    title: videoInfo.title,
                    pic: found.cover,
                    owner: found.author,
                    desc: videoInfo.desc,
                    pubDate: videoInfo.pubdate * 1000,
                    pages: pages.map(({ page, part, duration }) => ({ page, part, duration })),
                };
            }
            default:
                throw new Error("未实现的视频类型！！");
        }
    }

    async getResourceUrl(id: string, episode: number | string, filterResourceURL = false) {
        if (this.platform === "web") {
            return {
                url: this.apiPrefix + `/internal/resource?id=${id}&episode=${episode}`,
                isAudio: true,
            };
        }

        // 获取视频
        const { playInfo } = await this.getVideo(id, episode);
        const dashAudio = playInfo.data?.dash?.audio;
        const legacyVideo = playInfo.data?.durl;

        // [dash] 遍历获取最佳音质视频
        if (Array.isArray(dashAudio) && dashAudio.length > 0) {
            let maxQualityIndex = 0;
            dashAudio.forEach((_, index, array) => {
                if (array[maxQualityIndex].codecid < maxQualityIndex) {
                    maxQualityIndex = index;
                }
            });

            const { baseUrl, backupUrl } = dashAudio[maxQualityIndex];
            const urlList = [baseUrl];
            if (Array.isArray(backupUrl)) {
                urlList.push(...backupUrl);
            }

            if (!filterResourceURL) {
                this.logger.info(`没有进行过滤。来源域名列表: ${this.filterHostname(urlList).join(", ")}`);
                return { url: urlList[0], isAudio: true };
            }

            const newUrlList = filterCdnUrls(urlList);
            if (newUrlList.length <= 0) {
                this.logger.warn(
                    `过滤失败，因此使用原始地址列表中的第一项。来源域名列表: ${this.filterHostname(urlList).join(", ")}`,
                );
                return { url: urlList[0], isAudio: true };
            }
            this.logger.info(`过滤成功！来源域名列表: ${this.filterHostname(newUrlList).join(", ")}`);
            return { url: newUrlList[0], isAudio: true };
        }

        // [legacy] 尝试获取传统方式的视频
        if (Array.isArray(legacyVideo) && legacyVideo.length > 0) {
            if (!filterResourceURL) {
                this.logger.info(`没有进行过滤。来源域名列表: ${this.filterHostname(legacyVideo.map(e => e.url)).join(", ")}`);
                return { url: legacyVideo[0].url, isAudio: false };
            }

            const newUrlList = filterCdnUrls(legacyVideo.map(e => e.url));
            if (newUrlList.length <= 0) {
                this.logger.warn(
                    `过滤失败，因此使用原始地址列表中的第一项。来源域名列表: ${this.filterHostname(legacyVideo.map(e => e.url)).join(", ")}`,
                );
                return { url: legacyVideo[0].url, isAudio: false };
            }
            this.logger.info(`过滤成功！来源域名列表: ${this.filterHostname(newUrlList).join(", ")}`);
            return { url: newUrlList[0], isAudio: false };
        }

        throw new Error("找不到可用的音频资源");
    }

    // 实现 getVideo 方法
    private async getVideo(id: string, episode: number | string): Promise<VideoResponse> {
        return fetchVideo(id, episode, this.userAgent);
    }
}

export * from "./types";
