import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { PropsWithChildren } from "react";
import { View, StatusBar, StyleProp, ViewStyle } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

import PotatoButtonTitleBar from "~/components/potato-ui/PotatoButtonTitleBar";
import { createIcon } from "~/components/potato-ui/utils/icon";
import { useRawThemeValues } from "~/components/ui/gluestack-ui-provider/theme";
import { Text } from "~/components/ui/text";

export interface CommonFrameNewProps {
    title?: string | React.ReactNode;
    titleBarTheme?: "transparent" | "solid";
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
    const { colorValue, mode } = useRawThemeValues();
    const edgeInsetsRaw = useSafeAreaInsets();
    const edgeInsets: EdgeInsets = {
        top: overrideEdgeInsets?.top ?? edgeInsetsRaw.top,
        bottom: overrideEdgeInsets?.bottom ?? edgeInsetsRaw.bottom,
        left: overrideEdgeInsets?.left ?? edgeInsetsRaw.left,
        right: overrideEdgeInsets?.right ?? edgeInsetsRaw.right,
    };

    let textColor = "#ffffff";
    if (titleBarTheme === "transparent") {
        textColor = colorValue("--color-typography-700");
    }

    return (
        <View className={twMerge("h-full items-center bg-background-0", className)} style={style}>
            {titleBarTheme === "solid" && <SystemBars style="light" />}
            {titleBarTheme === "transparent" && <SystemBars style={mode === "dark" ? "light" : "dark"} />}
            <View
                className={twMerge(
                    "flex-0 basis-auto w-full " +
                        (titleBarTheme === "solid" ? "bg-primary-500 dark:bg-primary-100" : "bg-transparent"),
                    titleBarContainerClassName,
                )}
                style={[
                    {
                        paddingTop: edgeInsets.top,
                        paddingLeft: edgeInsets.left,
                        paddingRight: edgeInsets.right,
                    },
                    titleBarContainerStyle,
                ]}
            >
                <View
                    className={twMerge("h-16 p-[0.625rem] items-center justify-center", titleBarClassName)}
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
                        <View className="absolute p-[0.625rem] left-0 flex-row items-center gap-1">
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
                        <View className="absolute p-[0.625rem] right-0 flex-row items-center gap-1">
                            {rightAccessories}
                        </View>
                    )}
                </View>
            </View>
            <View
                className={twMerge("flex-1 w-full max-w-screen-lg", containerClassName)}
                style={[
                    {
                        paddingLeft: edgeInsets.left,
                        paddingRight: edgeInsets.right,
                        paddingBottom: edgeInsets.bottom,
                    },
                    containerStyle,
                ]}
            >
                {children}
            </View>
        </View>
    );
}
