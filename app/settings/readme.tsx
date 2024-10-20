import { useAssets } from "expo-asset";
import React, { useCallback } from "react";
import { Linking, Platform, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";

import CommonLayout from "~/components/CommonLayout";

const indexHtml = require("../../assets/web/index.html");

const History: React.FC = () => {
    const [html] = useAssets(indexHtml);
    const colorScheme = useColorScheme();
    const safeAreaInsets = useSafeAreaInsets();

    const colorSchemeJSON = JSON.stringify(colorScheme);

    const getSetMarginJavaScript = () => `
        document.documentElement.style.setProperty("--bs-margin-top", "${safeAreaInsets.top}px");
        document.documentElement.style.setProperty("--bs-margin-bottom", "${safeAreaInsets.bottom}px");
        document.documentElement.style.setProperty("--bs-margin-left", "${safeAreaInsets.left}px");
        document.documentElement.style.setProperty("--bs-margin-right", "${safeAreaInsets.right}px");
    `;

    const getSetColorSchemeJavaScript = () => `
        if (${colorSchemeJSON}) {
            document.documentElement.dataset.scheme = ${colorSchemeJSON};
        }
    `;

    const webviewRef = useCallback(
        (item: WebView | null) => {
            item?.injectJavaScript(getSetColorSchemeJavaScript());
            item?.injectJavaScript(`
            ${getSetMarginJavaScript()}
        `);
        },
        [getSetColorSchemeJavaScript, getSetMarginJavaScript],
    );

    return (
        <CommonLayout title="用户说明" leftAccessories="backButton" overrideEdgeInsets={{ bottom: 0 }}>
            {html && (
                <WebView
                    ref={webviewRef}
                    source={html[0]}
                    style={{
                        backgroundColor: "transparent",
                    }}
                    injectedJavaScript={`
                        ${getSetColorSchemeJavaScript()}
                        ${getSetMarginJavaScript()}
                        document.documentElement.dataset.platform = ${JSON.stringify(Platform.OS)};
                    `}
                    // https://stackoverflow.com/a/54115883
                    onShouldStartLoadWithRequest={event => {
                        if (event.url !== html[0].uri) {
                            Linking.openURL(event.url);
                            return false;
                        }
                        return true;
                    }}
                    // https://stackoverflow.com/questions/46690261/injectedjavascript-is-not-working-in-webview-of-react-native
                    onMessage={event => {}}
                    webviewDebuggingEnabled
                />
            )}
        </CommonLayout>
    );
};

export default History;
