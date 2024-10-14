import { Octicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";
import WebView from "react-native-webview";

import CommonLayout from "~/components/CommonLayout";
import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
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
    // const [content, setContent] = useState("");

    const { data } = useQuery({
        queryKey: ["log-show"],
        queryFn: getLogContentForDisplay,
        staleTime: 5000,
    });

    const webviewRef = useRef<WebView>(null);

    const handleShare = async () => {
        await shareLogContent(data ?? "");
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

    return (
        <CommonLayout
            title="导出日志"
            leftAccessories="backButton"
            rightAccessories={
                <PotatoButtonTitleBar
                    label="分享日志文件"
                    Icon={IconShare}
                    iconSize={22}
                    theme="solid"
                    onPress={() => handleShare()}
                />
            }
            overrideEdgeInsets={{ bottom: 0 }}
        >
            {data ? (
                <WebView
                    ref={webviewRef}
                    source={{
                        html: webTemplate(data),
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
