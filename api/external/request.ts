import type { AxiosRequestConfig } from "axios";
import axiosClient from "axios";

import { USER_AGENT_BILIBILI } from "~/constants/network";
import log from "~/utils/logger";
import { signParam } from "~/utils/wbi";

/**
 * Creates an initial 'axios' instance with custom settings.
 */
const instance = axiosClient.create({
    baseURL: "https://api.bilibili.com",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": USER_AGENT_BILIBILI,
    },
});

instance.interceptors.request.use(
    async req => {
        const params = req.params || {};
        const encodedParams = await signParam(params);
        req.url = `${req.url}?${encodedParams}`;
        delete req.params;
        log.debug(`发起请求：${req.url}`);
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
        // console.log(JSON.stringify(res, null, 4));
        if (res.data.code !== 0) {
            log.error(`发生业务错误：${res.data.code}，详情信息：${res.data.message}`);
            throw new Error(res.data.message);
        }
        return res.data;
    },
    err => {
        return Promise.reject(err);
    },
);

/**
 * Replaces main `axios` instance with the custom-one.
 *
 * Ref: https://stackoverflow.com/a/70765722/9436804
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
export const biliRequest = <T>(cfg: AxiosRequestConfig) => instance.request<any, T>(cfg);
