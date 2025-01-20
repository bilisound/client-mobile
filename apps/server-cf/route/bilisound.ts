import { IRequest, RouterType } from "itty-router";
import { getSDK } from "../utils/sdk";
import { ajaxError, ajaxSuccess } from "../utils/misc";
import { UserListMode } from "@bilisound/sdk";
import CORS_HEADERS from "../constants/cors";

function getHandleResource(method: string) {
    return async (request: IRequest, env: any) => {
        const id = request.query.id;
        const episode = Number(request.query.episode);
        const dl = request.query.dl;
        if (typeof id !== "string" || !Number.isInteger(episode) || episode < 1) {
            return ajaxError("api usage error", 400);
        }

        try {
            // 获取视频
            const sdk = getSDK(env);
            const range = request.headers.get("Range");

            const { aid, bvid, episodeName, data, contentRange, contentLength } = await sdk.getResource(id, episode, {
                method,
                range,
            });
            const fileName = `[${dl === "av" ? `av${aid}` : bvid}] [P${episode}] ${episodeName}.m4a`;

            return new Response(data, {
                status: range ? 206 : 200,
                headers: {
                    ...CORS_HEADERS,
                    ...(dl
                        ? {
                              "Content-Disposition": `filename*=utf-8''${encodeURIComponent(fileName)}`,
                          }
                        : {}),
                    "Content-Type": dl ? "application/octet-stream" : "audio/mp4",
                    "Accept-Ranges": "bytes",
                    "Cache-Control": "max-age=604800",
                    ...(range
                        ? {
                              "Content-Range": contentRange,
                              "Content-Length": contentLength,
                          }
                        : {}),
                },
            });
        } catch (e) {
            return ajaxError(e);
        }
    };
}

export default function bilisound(router: RouterType) {
    router.get("/api/internal/resolve-b23", async (request, env) => {
        const id = request.query.id;
        if (typeof id !== "string") {
            return ajaxError("api usage error", 400);
        }

        try {
            const sdk = getSDK(env);
            const url = await sdk.parseB23(id);
            return ajaxSuccess(url);
        } catch (e) {
            return ajaxError(e);
        }
    });

    router.get("/api/internal/user-list", async (request, env) => {
        const { userId, listId, page, mode } = request.query;
        if (
            typeof userId !== "string" ||
            typeof listId !== "string" ||
            typeof page !== "string" ||
            typeof mode !== "string"
        ) {
            return ajaxError("api usage error", 400);
        }

        const cache = env.bilisound as KVNamespace;
        const cacheKey = `BILI_USER_LIST_${userId}_${listId}_${page}_${mode}`;
        const got = await cache.get(cacheKey);
        if (got) {
            return ajaxSuccess(JSON.parse(got));
        }

        try {
            const sdk = getSDK(env);
            const url = await sdk.getUserList(mode as UserListMode, userId, listId, Number(page));
            return ajaxSuccess(url);
        } catch (e) {
            return ajaxError(e);
        }
    });

    router.get("/api/internal/metadata", async (request, env) => {
        const id = request.query.id;
        if (typeof id !== "string") {
            return ajaxError("api usage error", 400);
        }

        try {
            const sdk = getSDK(env);
            const res = await sdk.getMetadata(id);
            return ajaxSuccess(res);
        } catch (e) {
            return ajaxError(e);
        }
    });

    router.get("/api/internal/resource", getHandleResource("get"));

    router.head("/api/internal/resource", getHandleResource("head"));

    router.get("/api/internal/resource-metadata", async (request, env) => {});

    router.get("/api/internal/img-proxy", async request => {});

    router.get("/api/internal/raw", async (request, env) => {});

    router.get("/api/internal/debug-request", async (request, env) => {});

    router.post("/api/internal/transfer-list", async (request, env) => {});

    router.get("/api/internal/transfer-list/:id", async (request, env) => {});
}
