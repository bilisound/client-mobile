import { Ionicons, Octicons } from "@expo/vector-icons";
import { Pressable } from "@gluestack-ui/themed";
import * as Device from "expo-device";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import path from "path-browserify";
import React, { useEffect, useRef, useState } from "react";
import { Platform, useColorScheme } from "react-native";
import RNFS from "react-native-fs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import CommonLayout from "../components/CommonLayout";
import { BILISOUND_LOG_PATH } from "../constants/file";
import { COMMON_FRAME_SOLID_BUTTON_STYLE } from "../constants/style";
import useCommonColors from "../hooks/useCommonColors";

const webTemplate = (content: string) => `
<!doctype html>
<html lang="zh-hans-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
        :root {
            font-size: 14px;
        }
        body { 
            background-color: transparent;
            margin: 0;
        }
        pre {
            margin: 0;
            padding: 0.75rem;
            word-break: break-all;
            line-break: anywhere;
            white-space: pre-wrap;
        }
    </style>
    <title>Document</title>
</head>
<body style="display: none">
    <pre>${content}</pre>
</body>
</html>`;

const osMap: Record<typeof Platform.OS, string> = {
    ios: "iOS",
    android: "Android",
    macos: "macOS",
    windows: "Windows",
    web: "Web",
};

const App: React.FC = () => {
    const colorScheme = useColorScheme();
    const { textBasicColor } = useCommonColors();
    const safeAreaInsets = useSafeAreaInsets();
    const [content, setContent] = useState("");

    const webviewRef = useRef<WebView>(null);

    const handleCombineLog = async () => {
        // 获取设备信息
        let deviceInfo = `=============================
设备信息
=============================
`;
        deviceInfo += `系统: ${osMap[Platform.OS]} ${Device.osVersion}`;
        if (Platform.OS === "android") {
            deviceInfo += ` (API ${Device.platformApiLevel})`;
        }
        deviceInfo += "\n";
        deviceInfo += `设备类型: ${Device.deviceType}\n`;
        deviceInfo += `厂商: ${Device.brand}\n`;
        deviceInfo += `设备名称: ${Device.designName} (${Device.modelName})\n\n`;

        // 获取日志信息
        const fileList = await RNFS.readDir(BILISOUND_LOG_PATH);
        if (fileList.length <= 0) {
            setContent(`${deviceInfo}还没有日志呢~使用一段时间再来看看吧！`);
            return;
        }
        // desc
        fileList.sort((a, b) => (+(a.mtime ?? 0) < +(b.mtime ?? 0) ? 1 : -1));
        const filePath = fileList.map(e => e.path).filter(e => e.endsWith(".log"));
        let combined = "";
        for (let i = 0; i < Math.min(filePath.length, 3); i++) {
            const header = `=============================
${filePath[i]} 文件内容
=============================
`;
            combined = `${header + (await RNFS.readFile(filePath[i], "utf8"))}\n${combined}`;
        }
        setContent(deviceInfo + combined);
    };

    const handleShare = async () => {
        const targetLocation = `${
            RNFS.CachesDirectoryPath
        }/sharing-${new Date().getTime()}/bilisound-log-export-${new Date().getTime()}.log`;
        await RNFS.mkdir(path.parse(targetLocation).dir);
        await RNFS.writeFile(targetLocation, content, "utf8");
        await Sharing.shareAsync(`file://${encodeURI(targetLocation)}`, {
            mimeType: "text/plain",
        });
    };

    const getSetMarginJavaScript = () => `
        document.body.style.marginBottom = "${safeAreaInsets.bottom}px";
        document.body.style.marginLeft = "${safeAreaInsets.left}px";
        document.body.style.marginRight = "${safeAreaInsets.right}px";
    `;

    useEffect(() => {
        webviewRef.current?.injectJavaScript(`document.body.style.color = ${JSON.stringify(textBasicColor)};`);
    }, [textBasicColor]);

    useEffect(() => {
        webviewRef.current?.injectJavaScript(`
            ${getSetMarginJavaScript()}
        `);
    }, [getSetMarginJavaScript]);

    useEffect(() => {
        handleCombineLog();
    }, [handleCombineLog]);

    return (
        <CommonLayout
            title="导出日志"
            leftAccessories={
                <Pressable sx={COMMON_FRAME_SOLID_BUTTON_STYLE} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
            }
            rightAccessories={
                <Pressable sx={COMMON_FRAME_SOLID_BUTTON_STYLE} onPress={() => handleShare()}>
                    <Octicons name="share" size={24} color="#fff" />
                </Pressable>
            }
            extendToBottom
        >
            {content ? (
                <WebView
                    ref={webviewRef}
                    source={{
                        html: webTemplate(content),
                    }}
                    style={{
                        backgroundColor: "transparent",
                    }}
                    injectedJavaScript={`
                        document.body.style.color = ${JSON.stringify(textBasicColor)};
                        document.body.style.display = "";
                    `}
                    // https://stackoverflow.com/questions/46690261/injectedjavascript-is-not-working-in-webview-of-react-native
                    onMessage={event => {}}
                    webviewDebuggingEnabled
                />
            ) : null}
        </CommonLayout>
    );
};

export default App;
