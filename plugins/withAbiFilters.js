const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAbiFilters(config) {
    return withAppBuildGradle(config, config => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setAbiFilters(config.modResults.contents);
        } else {
            throw new Error("如果不是 groovy，则无法在 app/build.gradle 中设置 abiFilters");
        }
        return config;
    });
};

function setAbiFilters(appBuildGradle) {
    return appBuildGradle.replace(
        /defaultConfig\s*{/,
        `defaultConfig {
        ndk {
            abiFilters "arm64-v8a"
        }`,
    );
}
