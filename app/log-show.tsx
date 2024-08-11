import { Octicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";
import WebView from "react-native-webview";

import CommonLayout from "~/components/CommonLayout";
import ButtonTitleBar from "~/components/ui/ButtonTitleBar";
import { createIcon } from "~/components/ui/utils/icon";
import { getLogContentForDisplay, shareLogContent } from "~/utils/logger";

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

const IconShare = createIcon(Octicons, "share");

const App: React.FC = () => {
    const { theme } = useStyles();
    const textBasicColor = theme.colorTokens.foreground;
    const safeAreaInsets = useSafeAreaInsets();
    const [content, setContent] = useState("");

    const webviewRef = useRef<WebView>(null);

    const handleShare = async () => {
        await shareLogContent(content);
    };

    useEffect(() => {
        webviewRef.current?.injectJavaScript(`document.body.style.color = ${JSON.stringify(textBasicColor)};`);
    }, [textBasicColor]);

    useEffect(() => {
        webviewRef.current?.injectJavaScript(`
            document.body.style.marginBottom = "${safeAreaInsets.bottom}px";
            document.body.style.marginLeft = "${safeAreaInsets.left}px";
            document.body.style.marginRight = "${safeAreaInsets.right}px";
        `);
    }, [safeAreaInsets]);

    useEffect(() => {
        getLogContentForDisplay().then(e => setContent(e));
    }, []);

    return (
        <CommonLayout
            title="导出日志"
            leftAccessories="backButton"
            rightAccessories={
                <ButtonTitleBar label="分享日志文件" Icon={IconShare} iconSize={22} onPress={() => handleShare()} />
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
