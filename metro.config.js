const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
    isCSSEnabled: true,
});

// 添加对 .txt 文件的支持
config.resolver.assetExts.push("txt");

module.exports = withNativeWind(config, {
    input: "./global.css",
    inlineRem: 16,
});
