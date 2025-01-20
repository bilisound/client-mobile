import { BilisoundSDK } from "@bilisound/sdk";
import { USER_AGENT } from "../constants/values";

interface Endpoint {
    siteUrl: string;
    apiUrl: string;
    key: string;
}

export function getSDK(env: any) {
    const endpoints: Endpoint[] = env.ENDPOINT_BILI;
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

    return new BilisoundSDK({
        sitePrefix: endpoint.siteUrl,
        apiPrefix: endpoint.apiUrl,
        key: endpoint.key,
        userAgent: USER_AGENT,
    })
}
