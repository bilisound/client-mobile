import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { remapProps } from "nativewind";
import React, { PropsWithChildren } from "react";
import { View, StatusBar, StyleProp, ViewStyle } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { twMerge } from "tailwind-merge";

import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";

export interface CommonFrameNewProps {
    title?: string | React.ReactNode;
    titleBarTheme?: "transparent" | "transparentAlt" | "solid";
    /**
     * @deprecated 改用 `paddingBottom={0}` 谢谢喵
     */
    extendToBottom?: boolean;
    leftAccessories?: React.ReactNode | "backButton";
    rightAccessories?: React.ReactNode;

    className?: string;
    titleBarContainerClassName?: string;

    style?: StyleProp<ViewStyle>;
    titleBarContainerStyle?: StyleProp<ViewStyle>;
    titleBarStyle?: StyleProp<ViewStyle>;

    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
}

const IconArrowBack = createIcon(Ionicons, "arrow-back");

const CommonLayoutOriginal: React.FC<PropsWithChildren<CommonFrameNewProps>> = ({
    children,
    title,
    titleBarTheme = "solid",
    extendToBottom,
    leftAccessories,
    rightAccessories,

    className,
    titleBarContainerClassName,

    style,
    titleBarContainerStyle,
    titleBarStyle,

    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
}) => {
    const { styles, theme } = useStyles(styleSheet);
    const edgeInsetsRaw = useSafeAreaInsets();
    const edgeInsets: EdgeInsets = {
        top: paddingTop ?? edgeInsetsRaw.top,
        bottom: paddingBottom ?? edgeInsetsRaw.bottom,
        left: paddingLeft ?? edgeInsetsRaw.left,
        right: paddingRight ?? edgeInsetsRaw.right,
    };

    let textColor = theme.colorTokens.topBarSolidForeground;
    if (titleBarTheme === "transparent") {
        textColor = theme.colorTokens.topBarTransparentForeground;
    }
    if (titleBarTheme === "transparentAlt") {
        textColor = theme.colorTokens.topBarTransparentAltForeground;
    }

    return (
        <Box className={twMerge("h-full", className)} style={style}>
            {titleBarTheme === "solid" && <StatusBar barStyle="light-content" showHideTransition="none" />}
            <Box
                className={"flex-0 basis-auto " + (titleBarTheme === "solid" ? "bg-primary-500" : "bg-transparent")}
                style={[
                    {
                        paddingTop: edgeInsets.top,
                    },
                    titleBarContainerStyle,
                ]}
            >
                <Box
                    className={twMerge("h-16 p-[10px] items-center justify-center", titleBarContainerClassName)}
                    style={[titleBarStyle]}
                >
                    {typeof title === "string" ? (
                        <Text
                            className={
                                "text-base font-semibold " +
                                (titleBarTheme === "solid" ? "text-white" : "text-typography-700")
                            }
                        >
                            {title}
                        </Text>
                    ) : (
                        title
                    )}
                    {leftAccessories && (
                        <Box className="absolute p-[10px] left-0 flex-row items-center gap-1">
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
                        </Box>
                    )}
                    {rightAccessories && (
                        <View className="absolute p-[10px] right-0 flex-row items-center gap-1">
                            {rightAccessories}
                        </View>
                    )}
                </Box>
            </Box>
            <Box
                className="flex-1"
                style={[
                    {
                        paddingLeft: edgeInsets.left,
                        paddingRight: edgeInsets.right,
                        paddingBottom: extendToBottom ? 0 : edgeInsets.bottom,
                    },
                ]}
            >
                {children}
            </Box>
        </Box>
    );
};

const styleSheet = createStyleSheet(theme => ({}));

const CommonLayout = remapProps(CommonLayoutOriginal, {
    titleBarClassName: "titleBarStyle",
});

export default CommonLayout;
