import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { PropsWithChildren } from "react";
import { View, Text, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

import ButtonTitleBar from "~/components/ui/ButtonTitleBar";
import { createIcon } from "~/components/ui/utils/icon";

export interface CommonFrameNewProps {
    title?: string;
    titleBarTheme?: "transparent" | "solid";
    extendToBottom?: boolean;
    leftAccessories?: React.ReactNode | "backButton";
    rightAccessories?: React.ReactNode;
}

const IconArrowBack = createIcon(Ionicons, "arrow-back");

const CommonLayout: React.FC<PropsWithChildren<CommonFrameNewProps>> = ({
    children,
    title,
    titleBarTheme = "solid",
    extendToBottom,
    leftAccessories,
    rightAccessories,
}) => {
    const { styles, theme } = useStyles(styleSheet);
    const edgeInsets = useSafeAreaInsets();
    const textBasicColor = theme.colorTokens.foreground;

    const computedSolidColor = theme.colorTokens.topBarSolidBackground;
    const textSolidColor = theme.colors.white;
    const textColor = titleBarTheme === "solid" ? textSolidColor : textBasicColor;

    return (
        <View style={[styles.container]}>
            {titleBarTheme === "solid" && <StatusBar barStyle="light-content" showHideTransition="none" />}
            <View
                style={[
                    styles.titleBarContainer,
                    {
                        paddingTop: edgeInsets.top,
                        backgroundColor: titleBarTheme === "solid" ? computedSolidColor : "transparent",
                    },
                ]}
            >
                <View style={styles.titleBar}>
                    <Text style={[styles.titleText, { color: textColor }]}>{title}</Text>
                    {leftAccessories && (
                        <View style={styles.leftAccessories}>
                            {leftAccessories === "backButton" ? (
                                <ButtonTitleBar
                                    label="返回"
                                    Icon={IconArrowBack}
                                    iconColor={textColor}
                                    solid={titleBarTheme === "solid"}
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
