const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { withMonicon } = require("@monicon/metro");

const config = getDefaultConfig(__dirname);

const configWithNativeWind = withNativeWind(config, { input: "./global.css", inlineRem: 16 });

const configWithMonicon = withMonicon(configWithNativeWind, {
    icons: ["uil:qrcode-scan", "tabler:alert-square-rounded", "ri:skip-back-mini-fill"],
    collections: ["fa6-solid", "fa6-regular"],
});

module.exports = configWithMonicon;
