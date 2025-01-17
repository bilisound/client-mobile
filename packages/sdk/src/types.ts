import { WebPlayInfo } from "./types-vendor";

export interface Logger {
    info(...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
    debug(...msg: any[]): void;
}

export type GetMetadataResponse = {
    bvid: string;
    aid: number;
    title: string;
    pic: string;
    pubDate: number;
    desc: string;
    owner: {
        mid: number;
        name: string;
        face: string;
    };
    pages: {
        page: number;
        part: string;
        duration: number;
    }[];
    seasonId?: number;
};

export type VideoType = "regular" | "festival";

export type Numberish = string | number;

export interface VideoInitialState {
    videoData?: {
        bvid: string;
        aid: number;
        title: string;
        pic: string;
        owner: {
            mid: number;
            name: string;
            face: string;
        };
        desc_v2?: { raw_text: string }[];
        pubdate: number;
        pages: {
            page: number;
            part: string;
            duration: number;
        }[];
        season_id?: number;
        is_upower_exclusive?: boolean;
    };
    videoInfo?: {
        bvid: string;
        aid: number;
        title: string;
        desc: string;
        pubdate: number;
        pages: {
            page: number;
            part: string;
            duration: number;
        }[];
    };
    sectionEpisodes?: {
        bvid: string;
        cover: string;
        author: {
            mid: number;
            name: string;
            face: string;
        };
    }[];
}

export interface VideoResponse {
    initialState: VideoInitialState;
    playInfo: WebPlayInfo;
    type: VideoType;
}

export interface SDKOptions {
    logger?: Logger;
    userAgent?: string;
    apiPrefix?: string;
    sitePrefix?: string;
}
