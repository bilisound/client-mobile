import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import fetch from "node-fetch";
import { getStore } from "@netlify/blobs";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_REPO = "bilisound/client-mobile";
const GITHUB_RAW_BASE = "https://github.com";
const CACHE_CONTROL = "public, max-age=3600"; // Cache for 1 hour

// Define response types
interface NetlifyResponse {
    statusCode: number;
    headers?: Record<string, string>;
    body: string;
    isBase64Encoded?: boolean;
}

interface GitHubAsset {
    name: string;
    browser_download_url: string;
}

interface GitHubRelease {
    assets: GitHubAsset[];
    tag_name: string;
    name: string;
    body: string;
    published_at: string;
}

/**
 * Proxy for GitHub release files
 *
 * Routes:
 * - /latest - Get latest release info
 * - /releases - List all releases
 * - /download/:tag/:filename - Download a specific release asset
 * - /upload/:tag/:filename - Upload a file to Netlify Blobs
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<NetlifyResponse> => {
    const { path } = event;
    // Get the segments after the function name
    const segments = path ? path.split("/").filter(Boolean) : [];

    try {
        // Handle different routes
        if (segments[0] === "latest") {
            return await getLatestRelease();
        } else if (segments[0] === "releases") {
            return await listReleases();
        } else if (segments[0] === "download" && segments.length >= 3) {
            const tag = segments[1];
            const filename = segments.slice(2).join("/");
            return await downloadReleaseAsset(tag, filename);
        } else if (segments[0] === "upload" && segments.length >= 3) {
            const tag = segments[1];
            const filename = segments.slice(2).join("/");
            // Check if we have a request body
            if (!event.body) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "No file content provided" }),
                };
            }
            // Handle both base64 encoded and raw binary data
            const fileContent = event.isBase64Encoded ? Buffer.from(event.body, "base64") : Buffer.from(event.body);

            return await uploadFile(tag, filename, fileContent, event);
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Not found" }),
            };
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};

/**
 * Get the latest release information
 */
async function getLatestRelease(): Promise<NetlifyResponse> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO}/releases/latest`, {
        headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Bilisound-Netlify-Function",
        },
    });

    if (!response.ok) {
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: "Failed to fetch latest release" }),
        };
    }

    const data = (await response.json()) as GitHubRelease;

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": CACHE_CONTROL,
        },
        body: JSON.stringify(data),
    };
}

/**
 * List all releases
 */
async function listReleases(): Promise<NetlifyResponse> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO}/releases`, {
        headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Bilisound-Netlify-Function",
        },
    });

    if (!response.ok) {
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: "Failed to fetch releases" }),
        };
    }

    const data = (await response.json()) as GitHubRelease[];

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": CACHE_CONTROL,
        },
        body: JSON.stringify(data),
    };
}

/**
 * Download a specific release asset
 */
async function downloadReleaseAsset(tag: string, filename: string): Promise<NetlifyResponse> {
    // First, get the release to find the asset
    const releaseResponse = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_REPO}/releases/tags/${tag}`, {
        headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Bilisound-Netlify-Function",
        },
    });

    if (!releaseResponse.ok) {
        return {
            statusCode: releaseResponse.status,
            body: JSON.stringify({ error: "Failed to fetch release information" }),
        };
    }

    const releaseData = (await releaseResponse.json()) as GitHubRelease;

    // Find the asset with the matching name
    const asset = releaseData.assets.find(asset => asset.name === filename);

    if (!asset) {
        // If no exact match is found, try to download directly from the release tag
        // This is useful for files that are not uploaded as release assets but are part of the source code
        const directUrl = `${GITHUB_RAW_BASE}/${GITHUB_REPO}/releases/download/${tag}/${filename}`;

        try {
            const directResponse = await fetch(directUrl);

            if (!directResponse.ok) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "Asset not found" }),
                };
            }

            const contentType = directResponse.headers.get("content-type") || "application/octet-stream";
            const buffer = await directResponse.buffer();

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": contentType,
                    "Content-Disposition": `attachment; filename="${filename}"`,
                    "Cache-Control": CACHE_CONTROL,
                },
                body: buffer.toString("base64"),
                isBase64Encoded: true,
            };
        } catch (error) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Asset not found" }),
            };
        }
    }

    // Download the asset
    const downloadResponse = await fetch(asset.browser_download_url);

    if (!downloadResponse.ok) {
        return {
            statusCode: downloadResponse.status,
            body: JSON.stringify({ error: "Failed to download asset" }),
        };
    }

    const contentType = downloadResponse.headers.get("content-type") || "application/octet-stream";
    const buffer = await downloadResponse.buffer();

    return {
        statusCode: 200,
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": CACHE_CONTROL,
        },
        body: buffer.toString("base64"),
        isBase64Encoded: true,
    };
}

/**
 * Upload a file to Netlify Blobs storage
 */
async function uploadFile(
    tag: string,
    filename: string,
    fileContent: Buffer,
    event: HandlerEvent,
): Promise<NetlifyResponse> {
    try {
        // Create a store with the tag as the namespace
        const rawData = Buffer.from(event.blobs, 'base64')
        const data = JSON.parse(rawData.toString('ascii'))
        const store = getStore({
            edgeURL: data.url,
            name: `bilisound-${tag}`,
            token: data.token,
            siteID: '587240bf-c056-4920-bf0b-7b0d29ad6a38',
        })

        // Store the file with the filename as the key
        await store.set(filename, fileContent);

        // Return success response
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                success: true,
                message: "File uploaded successfully",
                tag,
                filename,
                size: fileContent.length,
            }),
        };
    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Failed to upload file",
                details: error instanceof Error ? error.message : String(error),
            }),
        };
    }
}
