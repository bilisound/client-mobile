import "ts-node/register";
import { ExpoConfig, ConfigContext } from "expo/config";

import packageJson from "./package.json";
import { BRAND } from "./constants/branding";

export default ({ config }: ConfigContext): ExpoConfig => ({
    name: "Bilisound",
    slug: "bilisound-client-mobile",
    version: packageJson.version,
    icon: "./assets/images/icon.png",
    scheme: "bilisound",
    userInterfaceStyle: "automatic",
    primaryColor: "#00ba9d",
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        infoPlist: {
            NSCameraUsageDescription: `${BRAND} 需要通过摄像头扫描二维码`,
            UIBackgroundModes: ["audio"],
        },
        bundleIdentifier: "moe.bilisound.app",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#97E7DC",
        },
        permissions: [
            "android.permission.MODIFY_AUDIO_SETTINGS",
            "android.permission.CAMERA",
            "android.permission.RECORD_AUDIO",
        ],
        package: "moe.bilisound.app",
    },
    web: {
        bundler: "metro",
        // output: "static",
        favicon: "./assets/images/favicon.png",
    },
    plugins: [
        "./plugins/withAndroidSignature",
        [
            "react-native-edge-to-edge",
            {
                android: {
                    enforceNavigationBarContrast: false,
                },
            },
        ],
        [
            "expo-splash-screen",
            {
                backgroundColor: "#ffffff",
                image: "./assets/images/icon.png",
                dark: {
                    image: "./assets/images/icon.png",
                    backgroundColor: "#171717",
                },
                imageWidth: 200,
            },
        ],
        "expo-router",
        [
            "expo-camera",
            {
                cameraPermission: `${BRAND} 需要通过摄像头扫描二维码`,
            },
        ],
        [
            "expo-build-properties",
            {
                android: {
                    // kotlinVersion: "2.0.0",
                    compileSdkVersion: 35,
                    targetSdkVersion: 35,
                    buildToolsVersion: "35.0.0",
                    usesCleartextTraffic: true,
                    enableProguardInReleaseBuilds: true,
                },
                ios: {
                    deploymentTarget: "17.0",
                },
            },
        ],
        "expo-font",
        "expo-asset",
        "expo-sqlite",
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {
            origin: false,
        },
    },
});
