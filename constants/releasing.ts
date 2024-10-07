export const VERSION = require("~/package.json").version;

export const RELEASE_CHANNEL = process.env.EXPO_PUBLIC_RELEASE_CHANNEL;

export type ReleaseChannel = "android_github" | "android_web";
