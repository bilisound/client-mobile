import { router } from "expo-router";
import sanitize from "sanitize-filename";

import { bv2av } from "./vendors/av-bv";

import { parseB23 } from "~/api/bilisound";
import log from "~/utils/logger";

export const B23_REGEX = /https?:\/\/b23\.tv\/([a-zA-Z0-9]+)/;
export const USER_LIST_URL_REGEX = /^\/(\d+)\/channel\/(seriesdetail|collectiondetail)$/;

export interface UserListParseResult {
    type: "userList";
    mode: "episode" | "series";
    userId: string;
    listId: string;
}

/**
 * 解析用户输入的视频内容。传入的字符串需要先行 trim 处理
 *
 * 支持的格式：
 *
 * - `188136`
 * - `av188136`
 * - `BV1Gx411w7wU`
 * - `https://www.bilibili.com/video/BV1Gx411w7wU`
 * - `https://m.bilibili.com/video/BV1Gx411w7wU`
 * - `https://b23.tv/k37TjOT`（需要调接口解析）
 * - `https://space.bilibili.com/701522855/channel/seriesdetail?sid=747414`
 * - `https://space.bilibili.com/1741301/channel/collectiondetail?sid=49333`
 * @param input
 */
export async function resolveVideo(input: string): Promise<string | UserListParseResult> {
    // 纯数字
    if (/^\d+$/.test(input)) {
        return `av${input}`;
    }

    // av 号、BV 号
    if (/^BV.+$/.test(input) || /^av\d+$/.test(input)) {
        return input;
    }

    // 含有 b23.tv 的短链接
    const tested = B23_REGEX.exec(input);
    if (tested && tested[1]) {
        return resolveVideo(await parseB23(tested[1]));
    }

    // 可能是链接
    const url = new URL(input);

    // 两种列表视频链接
    if (url.hostname === "space.bilibili.com") {
        const match = USER_LIST_URL_REGEX.exec(url.pathname);
        if (!match) {
            throw new Error("不是合法的视频列表 ID");
        }
        if (match[2] === "seriesdetail") {
            return {
                type: "userList",
                mode: "series",
                userId: match[1],
                listId: url.searchParams.get("sid") ?? "",
            };
        } else {
            return {
                type: "userList",
                mode: "episode",
                userId: match[1],
                listId: url.searchParams.get("sid") ?? "",
            };
        }
    }

    // 普通视频链接
    if (url.hostname.endsWith("bilibili.com")) {
        const id = url.pathname.split("/")[2];
        if (!id) {
            throw new Error("缺少地址参数");
        }
        if (!(id.startsWith("BV") || id.startsWith("av"))) {
            throw new Error("不是合法的视频 ID");
        }
        return id;
    }

    throw new Error("不支持的视频地址");
}

export interface GetFileNameOptions {
    id: string;
    episode: string;
    title: string;
    av: boolean;
    ext?: string;
}

export function getFileName(options: GetFileNameOptions) {
    const { id, episode, title, av } = options;
    const ext = options.ext ?? "m4a";
    const fileName = `[${av ? bv2av(id) : id}] [P${episode}] ${title.replaceAll("/", "∕")}.${ext}`;
    return sanitize(fileName);
}

export async function resolveVideoAndJump(value: string) {
    const parseResult = await resolveVideo(value);
    log.debug(`关键词解析结果: ${parseResult}`);
    if (typeof parseResult === "string") {
        router.push(`/query/${parseResult}`);
    } else if (parseResult.type === "userList") {
        router.push(`/remote-list?mode=${parseResult.mode}&userId=${parseResult.userId}&listId=${parseResult.listId}`);
    } else {
        throw new Error("不是有效的输入，无法进行下一步操作");
    }
}
