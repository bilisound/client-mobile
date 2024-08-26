import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { PropsWithChildren } from "react";
import { View, Text, StatusBar, StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";

export interface CommonFrameNewProps {
    title?: string;
    titleBarTheme?: "transparent" | "transparentAlt" | "solid";
    extendToBottom?: boolean;
    leftAccessories?: React.ReactNode | "backButton";
    rightAccessories?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    titleBarStyle?: StyleProp<ViewStyle>;
}

const IconArrowBack = createIcon(Ionicons, "arrow-back");

const CommonLayout: React.FC<PropsWithChildren<CommonFrameNewProps>> = ({
    children,
    title,
    titleBarTheme = "solid",
    extendToBottom,
    leftAccessories,
    rightAccessories,
    containerStyle,
    titleBarStyle,
}) => {
    const { styles, theme } = useStyles(styleSheet);
    const edgeInsets = useSafeAreaInsets();

    const computedSolidColor = theme.colorTokens.topBarSolidBackground;
    let textColor = theme.colorTokens.topBarSolidForeground;
    if (titleBarTheme === "transparent") {
        textColor = theme.colorTokens.topBarTransparentForeground;
    }
    if (titleBarTheme === "transparentAlt") {
        textColor = theme.colorTokens.topBarTransparentAltForeground;
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {titleBarTheme === "solid" && <StatusBar barStyle="light-content" showHideTransition="none" />}
            <View
                style={[
                    styles.titleBarContainer,
                    {
                        paddingTop: edgeInsets.top,
                        backgroundColor: titleBarTheme === "solid" ? computedSolidColor : "transparent",
                    },
                    titleBarStyle,
                ]}
            >
                <View style={styles.titleBar}>
                    <Text
                        style={[
                            styles.titleText,
                            { color: titleBarTheme === "solid" ? theme.colors.white : theme.colorTokens.foreground },
                        ]}
                    >
                        {title}
                    </Text>
                    {leftAccessories && (
                        <View style={styles.leftAccessories}>
                            {leftAccessories === "backButton" ? (
                                <PotatoButtonTitleBar
                                    label="返回"
                                    Icon={IconArrowBack}
                                    iconColor={textColor}
                                    theme={titleBarTheme}
                                    onPress={() => router.back()}
                                />
                            ) : (
                                leftAccessories
                            )}
                        </View>
                    )}
                    {rightAccessories && <View style={styles.rightAccessories}>{rightAccessories}</View>}
                </View>
            </View>
            <View
                style={[
                    styles.content,
                    {
                        paddingLeft: edgeInsets.left,
                        paddingRight: edgeInsets.right,
                        paddingBottom: extendToBottom ? 0 : edgeInsets.bottom,
                    },
                ]}
            >
                {children}
            </View>
        </View>
    );
};

const styleSheet = createStyleSheet(theme => ({
    container: {
        height: "100%",
    },
    titleBarContainer: {
        flex: 0,
        flexBasis: "auto",
    },
    titleBar: {
        height: 56,
        padding: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 16,
        fontWeight: "700",
    },
    leftAccessories: {
        position: "absolute",
        padding: 8,
        left: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    rightAccessories: {
        position: "absolute",
        padding: 8,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    content: {
        flex: 1,
    },
}));

export default CommonLayout;
