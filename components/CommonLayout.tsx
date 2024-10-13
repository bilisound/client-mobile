import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { PropsWithChildren } from "react";
import { View, StatusBar, StyleProp, ViewStyle } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "react-native-unistyles";
import { twMerge } from "tailwind-merge";

import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { Text } from "~/components/ui/text";

export interface CommonFrameNewProps {
    title?: string | React.ReactNode;
    titleBarTheme?: "transparent" | "solid";
    /**
     * @deprecated 改用 `overrideEdgeInsets` 谢谢喵
     */
    extendToBottom?: boolean;
    leftAccessories?: React.ReactNode | "backButton";
    rightAccessories?: React.ReactNode;

    className?: string;
    titleBarContainerClassName?: string;
    titleBarClassName?: string;
    containerClassName?: string;

    style?: StyleProp<ViewStyle>;
    titleBarContainerStyle?: StyleProp<ViewStyle>;
    titleBarStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;

    overrideEdgeInsets?: Partial<EdgeInsets>;
}

const IconArrowBack = createIcon(Ionicons, "arrow-back");

export default function CommonLayout({
    children,
    title,
    titleBarTheme = "solid",
    extendToBottom,
    leftAccessories,
    rightAccessories,

    className,
    titleBarContainerClassName,
    titleBarClassName,
    containerClassName,

    style,
    titleBarContainerStyle,
    titleBarStyle,
    containerStyle,

    overrideEdgeInsets = {},
}: PropsWithChildren<CommonFrameNewProps>) {
    const { theme } = useStyles();
    const edgeInsetsRaw = useSafeAreaInsets();
    const edgeInsets: EdgeInsets = {
        top: overrideEdgeInsets?.top ?? edgeInsetsRaw.top,
        bottom: overrideEdgeInsets?.bottom ?? edgeInsetsRaw.bottom,
        left: overrideEdgeInsets?.left ?? edgeInsetsRaw.left,
        right: overrideEdgeInsets?.right ?? edgeInsetsRaw.right,
    };

    let textColor = theme.colorTokens.topBarSolidForeground;
    if (titleBarTheme === "transparent") {
        textColor = theme.colorTokens.topBarTransparentForeground;
    }

    return (
        <View className={twMerge("h-full", className)} style={style}>
            {titleBarTheme === "solid" && <StatusBar barStyle="light-content" showHideTransition="none" />}
            <View
                className={twMerge(
                    "flex-0 basis-auto " +
                        (titleBarTheme === "solid" ? "bg-primary-500 dark:bg-primary-100" : "bg-transparent"),
                    titleBarContainerClassName,
                )}
                style={[
                    {
                        paddingTop: edgeInsets.top,
                    },
                    titleBarContainerStyle,
                ]}
            >
                <View
                    className={twMerge("h-16 p-[10px] items-center justify-center", titleBarClassName)}
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
                        <View className="absolute p-[10px] left-0 flex-row items-center gap-1">
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
                    {rightAccessories && (
                        <View className="absolute p-[10px] right-0 flex-row items-center gap-1">
                            {rightAccessories}
                        </View>
                    )}
                </View>
            </View>
            <View
                className={twMerge("flex-1", containerClassName)}
                style={[
                    {
                        paddingLeft: edgeInsets.left,
                        paddingRight: edgeInsets.right,
                        paddingBottom: extendToBottom ? 0 : edgeInsets.bottom,
                    },
                    containerStyle,
                ]}
            >
                {children}
            </View>
        </View>
    );
}
