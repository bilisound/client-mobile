const { withAppBuildGradle } = require("@expo/config-plugins");
module.exports = function withAbiFilters(config) {
    return withAppBuildGradle(config, config => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setAbiFilters(config.modResults.contents);
        } else {
            throw new Error("Cannot set abiFilters in the app/build.gradle if it's not groovy");
        }
        return config;
    });
};
function setAbiFilters(appBuildGradle) {
    const pattern = /abiFilters.*/;
    if (appBuildGradle.match(pattern)) {
        return appBuildGradle.replace(pattern, `abiFilters "arm64-v8a"`);
    }
    return appBuildGradle.replace(
        /defaultConfig\s*{/,
        `defaultConfig {
        ndk {
            abiFilters "arm64-v8a"
        }`,
    );
}
