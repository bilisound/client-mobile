import { GetMetadataResponse, Logger, SDKOptions, VideoResponse } from "./types";
import { filterCdnUrls } from "./cdn";
import { InitialStateFestivalResponse, InitialStateResponse, WebPlayInfo } from "./types-vendor";
import { extractJSON } from "./utils";
import axiosClient from "axios";
import { signParam } from "./wbi";
import { BiliRequestConfig, InternalBiliRequestConfig } from "./request";
import { Numberish } from "./types";
import { UserSeasonInfo, UserSeriesInfo, UserSeriesMetadata } from "./types-vendor";

export class BilisoundSDK {
    logger: Logger;
    userAgent: string = "";
    sitePrefix: string = "";
    apiPrefix: string = "";
    request: <T>(cfg: BiliRequestConfig) => Promise<T>;

    constructor(options: SDKOptions = {}) {
        this.logger = options.logger ?? {
            info: console.info.bind(console),
            warn: console.warn.bind(console),
            error: console.error.bind(console),
            debug: console.debug.bind(console),
        };
        this.userAgent = options.userAgent;
        this.sitePrefix = options.sitePrefix;
        this.apiPrefix = options.apiPrefix;
        this.initRequest();
    }

    initRequest() {
        const instance = axiosClient.create({
            baseURL: this.apiPrefix,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": this.userAgent,
            },
        });

        instance.interceptors.request.use(
            async (req: InternalBiliRequestConfig) => {
                if (!req.disableWbi) {
                    const params = req.params || {};
                    const encodedParams = await signParam(params, this.sitePrefix, this.userAgent);
                    req.url = `${req.url}?${encodedParams}`;
                    delete req.params;
                }
                this.logger.debug(`发起请求：${req.url}`);
                return req;
            },
            error => {
                return Promise.reject(error);
            },
        );

        /**
         * Handle all responses. It is possible to add handlers
         * for requests, but it is omitted here for brevity.
         */
        instance.interceptors.response.use(
            res => {
                if (res.data.code !== 0) {
                    this.logger.error(`发生业务错误：${res.data.code}，详情信息：${res.data.message}`);
                    throw new Error(res.data.message);
                }
                return res.data;
            },
            err => {
                return Promise.reject(err);
            },
        );

        this.request = <T>(cfg: BiliRequestConfig) => instance.request<any, T>(cfg);
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
        // 获取视频网页
        const videoData = await this.getVideo(id, 1);
        return this.parseVideoData(videoData);
    }

    async getResourceUrl(id: string, episode: number | string, filterResourceURL = false) {
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

    // 工具部分

    private async fetchRaw(url: string) {
        const res = await fetch(url, {
            headers: {
                "user-agent": this.userAgent,
            },
        });
        return { finalUrl: res.url, response: await res.text() };
    };

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

    // JSON 请求部分

    private async getVideo(id: string, episode: number | string): Promise<VideoResponse> {
        const { finalUrl, response } = await this.fetchRaw(`${this.sitePrefix}${id}/?p=${episode}`);

        this.logger.debug(`最终跳转结果：${finalUrl}`);
        if (finalUrl.startsWith("https://www.bilibili.com/festival/")) {
            this.logger.debug(`按照活动视频处理该查询`);
            // 提取视频播放信息
            const initialState: InitialStateFestivalResponse = extractJSON(
                /window\.__INITIAL_STATE__=(\{.+});\(function\(\)\{/,
                response,
            );
            // 提取视频流信息
            const playInfo = await this.getVideoUrlFestival(
                finalUrl,
                initialState.videoInfo.aid,
                initialState.videoInfo.bvid,
                initialState.videoInfo.pages[0].cid,
            );

            return { type: "festival", initialState, playInfo };
        } else {
            // 提取视频播放信息
            this.logger.debug(`按照常规视频处理该查询`);
            const initialState: InitialStateResponse = extractJSON(
                /window\.__INITIAL_STATE__=(\{.+});\(function\(\){/,
                response,
            );
            let playInfo: WebPlayInfo;
            try {
                playInfo = extractJSON(/window\.__playinfo__=(\{.+})<\/script><script>window.__INITIAL_STATE__=/, response);
            } catch (e) {
                this.logger.debug(`匹配关键词失败：${e}`);
                if (initialState.videoData.pages) {
                    this.logger.debug("正在采用降级方案……");
                    playInfo = await this.getVideoUrlFestival(
                        finalUrl,
                        initialState.videoData.aid,
                        initialState.videoData.bvid,
                        initialState.videoData.pages.find(e => e.page === Number(episode))?.cid ?? 0,
                    );
                } else {
                    throw e;
                }
            }
            return { type: "regular", initialState, playInfo };
        }
    }

    private async getVideoUrlFestival(referer: string, avid: Numberish, bvid: string, cid: Numberish) {
        return this.request<WebPlayInfo>({
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
    }

    private async getUserSeason(userId: Numberish, seasonId: Numberish, pageNum = 1) {
        return this.request<UserSeasonInfo>({
            url: "/x/polymer/web-space/seasons_archives_list",
            params: {
                mid: userId,
                season_id: seasonId,
                sort_reverse: false,
                page_num: pageNum,
                page_size: 30,
            },
            headers: {
                referer: `https://space.bilibili.com/${userId}/lists/${seasonId}?type=season`,
            },
        });
    }

    private async getUserSeries(userId: Numberish, seriesId: Numberish, pageNum = 1) {
        return this.request<UserSeriesInfo>({
            url: "/x/series/archives",
            params: {
                mid: userId,
                series_id: seriesId,
                only_normal: true,
                sort: "desc",
                pn: pageNum,
                ps: 30,
            },
            headers: {
                referer: `https://space.bilibili.com/${userId}/lists/${seriesId}?type=series`,
            },
        });
    }

    private async getUserSeriesMeta(seriesId: Numberish) {
        return this.request<UserSeriesMetadata>({
            url: "/x/series/series",
            params: {
                series_id: seriesId,
            },
            disableWbi: true,
        });
    }
}

export * from "./types";
export * from "./types-vendor";
