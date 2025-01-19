import { RouterType } from "itty-router";
import { getSDK } from "../utils/sdk";
import { ajaxError, ajaxSuccess } from "../utils/misc";

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
    });

    router.get("/api/internal/metadata", async (request, env) => {
    });

    router.get("/api/internal/resource", async (request, env) => {
    });

    router.head("/api/internal/resource", async (request, env) => {
    });

    router.get("/api/internal/resource-metadata", async (request, env) => {
    });

    router.get("/api/internal/img-proxy", async request => {
    });

    router.get("/api/internal/raw", async (request, env) => {
    });

    router.get("/api/internal/debug-request", async (request, env) => {
    });

    router.post("/api/internal/transfer-list", async (request, env) => {
    });

    router.get("/api/internal/transfer-list/:id", async (request, env) => {
    });
}
