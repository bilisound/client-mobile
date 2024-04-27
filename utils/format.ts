import sanitize from "sanitize-filename";

import { bv2av } from "./vendors/av-bv";
import { parseB23 } from "../api/bilisound";

export const B23_REGEX = /https?:\/\/b23\.tv\/([a-zA-Z0-9]+)/;

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
 * @param input
 */
export async function resolveVideo(input: string): Promise<string> {
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
