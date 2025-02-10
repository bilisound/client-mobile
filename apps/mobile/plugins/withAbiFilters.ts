import { withAppBuildGradle } from "@expo/config-plugins";
import { ExpoConfig } from "expo/config";

export default function withAbiFilters(config: ExpoConfig) {
    return withAppBuildGradle(config, config => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setAbiFilters(config.modResults.contents);
        } else {
            throw new Error("如果不是 groovy，则无法在 app/build.gradle 中设置 abiFilters");
        }
        return config;
    });
}

function setAbiFilters(appBuildGradle: string) {
    return appBuildGradle.replace(
        /defaultConfig\s*{/,
        `defaultConfig {
        ndk {
            abiFilters "arm64-v8a"
        }`,
    );
}
