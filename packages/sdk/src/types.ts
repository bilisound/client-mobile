import { InitialStateResponse, WebPlayInfo } from "./types-vendor";
import { InitialStateFestivalResponse } from "@bilisound/mobile/api/external/types";

export type Numberish = string | number;

export interface Logger {
    info(...msg: any[]): void;
    warn(...msg: any[]): void;
    error(...msg: any[]): void;
    debug(...msg: any[]): void;
}

export interface SDKOptions {
    logger?: Logger;
    userAgent?: string;
    apiPrefix?: string;
    sitePrefix?: string;
}

export interface GetMetadataResponse {
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
}

export interface GetVideoResponse {
    type: "regular";
    initialState: InitialStateResponse;
    playInfo: WebPlayInfo;
}

export interface GetVideoFestivalResponse {
    type: "festival";
    initialState: InitialStateFestivalResponse;
    playInfo: WebPlayInfo;
}

export interface EpisodeItem {
    bvid: string;
    title: string;
    cover: string;
    duration: number;
}

export interface GetEpisodeUserResponse {
    pageSize: number;
    pageNum: number;
    total: number;
    rows: EpisodeItem[];
    meta: {
        name: string;
        description: string;
        cover: string;
        userId: Numberish;
        seasonId: Numberish;
    };
}

export type UserListMode = "season" | "series" | "favourite";
