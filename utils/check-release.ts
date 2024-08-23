import * as semver from "semver";

import { USER_AGENT_BILISOUND } from "~/constants/network";
import { RELEASE_CHANNEL } from "~/constants/release-channel";

export interface CheckLatestVersionReturns {
    isLatest: boolean;
    currentVersion: string;
    latestVersion: string;
    extraInfo: string;
    downloadUrl: string;
}

export async function checkLatestVersionGithub(currentVersion: string): Promise<CheckLatestVersionReturns> {
    const response = await fetch("https://api.github.com/repos/bilisound/client-mobile/releases/latest", {
        headers: {
            "User-Agent": USER_AGENT_BILISOUND,
        },
    }).then(e => e.json());
    const latestVersion = response.tag_name.replace("v", "");

    if (!semver.valid(currentVersion) || !semver.valid(latestVersion)) {
        throw new Error("Invalid version format");
    }

    return {
        isLatest: semver.gte(currentVersion, latestVersion),
        currentVersion,
        latestVersion,
        extraInfo: "",
        downloadUrl: "https://github.com/bilisound/client-mobile/releases/latest",
    };
}

export async function checkLatestVersion(currentVersion: string) {
    switch (RELEASE_CHANNEL) {
        case "android_github": {
            return checkLatestVersionGithub(currentVersion);
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
