export const USER_AGENT_BILIBILI =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

export const USER_AGENT_BILISOUND = `Bilisound/${require("../package.json").version}`;

export const BILIBILI_VIDEO_URL_PREFIX = "https://www.bilibili.com/video/";

export const BILIBILI_GOOD_CDN_REGEX: readonly RegExp[] = [/^upos-[hs]z-[a-z|0-9]+\..+\.[a-z]+$/];
