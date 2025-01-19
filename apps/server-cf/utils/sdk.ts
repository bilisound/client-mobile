import { BilisoundSDK } from "@bilisound/sdk";

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
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    })
}
