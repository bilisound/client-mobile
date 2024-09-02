const { withAppBuildGradle } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withAndroidSignature(config) {
    return withAppBuildGradle(config, config => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setAndroidSignature(config.modResults.contents);
        } else {
            throw new Error("如果不是 groovy，则无法在 app/build.gradle 中设置 signingConfigs");
        }
        return config;
    });
};

function setAndroidSignature(appBuildGradle) {
    if (!fs.existsSync(path.resolve(__dirname, "../credentials.json"))) {
        console.warn("警告：没有设置正式版本的 Android Keystore 文件，因为 credentials.json 不存在。");
        return appBuildGradle;
    }
    const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../credentials.json"), { encoding: "utf8" }));

    // 使用正则表达式插入签名信息
    let output = appBuildGradle.replace(
        /(signingConfigs\s*\{)/,
        `$1
        release {
            storeFile file(${JSON.stringify(path.resolve(__dirname, "../credentials/android-release.keystore"))})
            storePassword ${JSON.stringify(info.android.keystore.keystorePassword)}
            keyAlias ${JSON.stringify(info.android.keystore.keyAlias)}
            keyPassword ${JSON.stringify(info.android.keystore.keyPassword)}
        }`,
    );

    // 使用正则表达式替换 signingConfig
    output = output.replace(
        /(release\s*\{)[^}]*?signingConfig\s+signingConfigs\.debug/s,
        `$1
            signingConfig signingConfigs.release
`,
    );

    return output;
}
