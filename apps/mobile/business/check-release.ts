import * as semver from "semver";

import { USER_AGENT_BILISOUND } from "~/constants/network";
import { RELEASE_CHANNEL } from "~/constants/releasing";

export interface CheckLatestVersionReturns {
    isLatest: boolean;
    currentVersion: string;
    latestVersion: string;
    extraInfo: string;
    downloadUrl: string;
}

export async function checkLatestVersionGithub(
    currentVersion: string,
    includePrerelease = false,
): Promise<CheckLatestVersionReturns> {
    const endpoint = includePrerelease
        ? "https://api.github.com/repos/bilisound/client-mobile/releases"
        : "https://api.github.com/repos/bilisound/client-mobile/releases/latest";
    const response = await fetch(endpoint, {
        headers: {
            "User-Agent": USER_AGENT_BILISOUND,
        },
    }).then(e => e.json());
    const latestRelease = includePrerelease ? response.find((r: any) => r.prerelease) || response[0] : response;
    const latestVersion = latestRelease.tag_name.replace("v", "");

    if (!semver.valid(currentVersion) || !semver.valid(latestVersion)) {
        throw new Error("Invalid version format");
    }

    return {
        isLatest: semver.gte(currentVersion, latestVersion),
        currentVersion,
        latestVersion,
        extraInfo: "",
        downloadUrl: latestRelease.html_url,
    };
}

export async function checkLatestVersion(currentVersion: string) {
    switch (RELEASE_CHANNEL) {
        case "android_github": {
            return checkLatestVersionGithub(currentVersion, false);
        }
        case "android_github_beta": {
            return checkLatestVersionGithub(currentVersion, true);
        }
        default: {
            return {
                isLatest: true,
                currentVersion,
                latestVersion: currentVersion,
                extraInfo: "",
                downloadUrl: "",
            };
        }
    }
}
