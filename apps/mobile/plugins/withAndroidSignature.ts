import configPlugins from "@expo/config-plugins";
import { ExpoConfig } from "expo/config";
import fs from "fs";
import path from "path";

// 不使用 import { withAppBuildGradle } from "@expo/config-plugins"; 写法的原因：
// 会导致无法编译，是因为 ESM 和 CJS 互操作性问题导致的
// （此解决方法由 @suemor233 提出）
const { withAppBuildGradle } = configPlugins;

export default function withAndroidSignature(config: ExpoConfig) {
    return withAppBuildGradle(config, config => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = setAndroidSignature(config.modResults.contents);
        } else {
            throw new Error("如果不是 groovy，则无法在 app/build.gradle 中设置 signingConfigs");
        }
        return config;
    });
}

function setAndroidSignature(appBuildGradle: string) {
    if (!fs.existsSync(path.resolve("./credentials.json"))) {
        console.warn("警告：没有设置正式版本的 Android Keystore 文件，因为 credentials.json 不存在。");
        return appBuildGradle;
    }
    const info = JSON.parse(fs.readFileSync(path.resolve("./credentials.json"), { encoding: "utf8" }));

    // 使用正则表达式插入签名信息
    let output = appBuildGradle.replace(
        /(signingConfigs\s*\{)/,
        `$1
        release {
            storeFile file(${JSON.stringify(path.resolve("./credentials/bilisound-release.keystore"))})
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
